import uuid
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class DeleteRoom(APIView):
    lookup_url_kwarg = 'code'

    def delete(self, request, format=None):
        code = request.data.get(self.lookup_url_kwarg)
        if code is not None:
            try:
                room = Room.objects.get(code=code)
                room.delete()
                return Response({'message': f'Room with code {code} deleted successfully.'}, status=status.HTTP_200_OK)
            except Room.DoesNotExist:
                return Response({'message': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Code parameter not found in request.'}, status=status.HTTP_400_BAD_REQUEST)


class DeleteUserRooms(APIView):
    def delete(self, request, format=None):
        session_key = self.request.session.session_key
        if session_key is not None:
            rooms = Room.objects.filter(host=session_key)
            rooms.delete()
            return Response({'message': 'All rooms deleted successfully.'}, status=status.HTTP_200_OK)
        return Response({'message': 'No rooms found for the user.'}, status=status.HTTP_404_NOT_FOUND)


class AllRoomsView(APIView):
    def get(self, request, format=None):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class JoinRoom(APIView):
    def post(self, request, format=None):
        print(request.data)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get('code')

        if code is not None:
            room_result = Room.objects.filter(code=code)
            if room_result.exists():
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid Post Data, Did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if room.exists():
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')

            # Generate a unique identifier for the host using uuid
            host = str(uuid.uuid4())

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

            data = {
                'code': self.request.session.get('room_code')
            }
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    class Meta:
        model = Room
        fields = ('guests_can_pause', 'votes_to_skip')

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                guest_can_pause = serializer.data.get('guest_can_pause')
                votes_to_skip = serializer.data.get('votes_to_skip')
                code = serializer.data.get('code')
                if code is not None:
                    room_result = Room.objects.filter(code=code)
                    if room_result.exists():
                        return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
                    room = room_result[0]
                    user_id = self.request.session.session_key
                    if room.host != user_id:
                        return Response({'message': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)
                    room.guest_can_pause = guest_can_pause
                    room.votes_to_skip = votes_to_skip
                    room.save(update_fields=[
                              'guest_can_pause', 'votes_to_skip'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

                return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

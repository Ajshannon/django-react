from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, AllRoomsView, DeleteRoom, DeleteUserRooms, UpdateRoom

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('all-rooms', AllRoomsView.as_view()),
    path('user-in-room', AllRoomsView.as_view()),
    path('delete-user-rooms/', DeleteUserRooms.as_view(), name='delete-user-rooms'),
    path('delete-room/', DeleteRoom.as_view(), name='delete-room'),
    path('update-room', UpdateRoom.as_view())
]

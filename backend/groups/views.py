from rest_framework import viewsets, generics, status
from groups import models
from .serializers import UserSerializer, GroupCreateSerializer, RatingSerializer, WeddingInviteResponseSerializer, WeddingInviteSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from groups import permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny

from django.http import Http404
from rest_framework.views import APIView
UserModel = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = models.Group.objects.all()
    serializer_class = GroupCreateSerializer

    permission_classes = (IsAuthenticated, permissions.IsOwnerOrReadOnly,)

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = models.Group.objects.all()
        course = self.request.query_params.get('course', None)
        if course is not None:
            queryset = queryset.filter(course=course)
        return queryset

    # @detail_route(methods=['get'])
    # def users_in_class()
    # @detail_route(methods=['patch'])
    # def remove_members_from_group(self, request, pk):
    #     group = self.get_object()
    #     members_to_remove = request.data['members']
    #     group.members.remove(members_to_remove)
    #     return Response(self.serializer_class(group).data)


# class CourseList(generics.ListAPIView):
#     serializer_class = GroupCreateSerializer

#     def get_queryset(self):
#         """
#         This view should return a list of all the purchases for
#         the user as determined by the username portion of the URL.
#         """
#         course = self.kwargs['course']
#         return Purchase.objects.filter(group__course=course)

class RatingViewSet(viewsets.ModelViewSet):
    queryset = models.Rating.objects.all()
    serializer_class = RatingSerializer

class WeddingInviteView(viewsets.ModelViewSet):
    queryset = models.WeddingInvite.objects.all()
    serializer_class = WeddingInviteSerializer

class WeddingInviteResponseView(APIView):
    serializer_class = WeddingInviteResponseSerializer

    # models.WeddingInvite.objects.get()
    def get_object(self, pk):
        try:
            return models.WeddingInvite.objects.get(pk=pk)
        except models.WeddingInvite.DoesNotExist:
            raise Http404

    def post(self, request, pk):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            response = serializer.data['response']
            invite = self.get_object(pk)

            if response == True:
                invite.accept()
                return Response({'success': "Wedding Invited accepted"}, status=status.HTTP_200_OK)
            else:
                invite.decline()
                return Response({'success': "Wedding Invited declined"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
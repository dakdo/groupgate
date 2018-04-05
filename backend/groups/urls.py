from django.urls import path
from .views import UserViewSet, GroupViewSet, RatingViewSet, InviteView, InviteResponseView, CourseViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewSet, base_name='users')
router.register('groups', GroupViewSet, base_name='groups')
router.register('ratings', RatingViewSet, base_name='ratings')
router.register('invites', InviteView, base_name="invites")
router.register('courses', CourseViewSet, base_name='courses')

urlpatterns = [
    #  path('groups/course/<str:course>/', CourseList),
    path('invites/<int:pk>/response/', InviteResponseView.as_view(), name='invite-response'),
]

urlpatterns += router.urls
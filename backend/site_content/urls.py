from django.urls import path
from . import views

urlpatterns = [
    path('site-info/', views.SiteInfoView.as_view(), name='site-info'),
    path('services/', views.ServiceCategoryListView.as_view(), name='services'),
    path('showcases/', views.ShowcaseListView.as_view(), name='showcases'),
]

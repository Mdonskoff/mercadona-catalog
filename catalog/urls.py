from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("index.html", views.index, name="index"),
    # path("", views.login('django.contrib.auth.urls')),
    path("admin.html", views.admin, name="admin"),
    path("catalog.html", views.catalog, name="catalog"),
    path("login.html", views.login_user, name="login"),
    path("logout.html", views.logout_user, name="logout"),

    # API
    path("catalog.json", views.catalog_json, name="catalog_json"),
    path("product.json", views.product_json, name="product_json"),
    path("categories.json", views.categories_json, name="categories_json"),
    path('delete/<int:id>/', views.delete, name="delete"),
]

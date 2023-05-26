from .models import Product, Discount, ProductCategory
from datetime import datetime
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.template import loader
from django.utils.timezone import make_aware

###############################################################################
############## HTML PAGES #####################################################
###############################################################################


def index(request):
    template = loader.get_template("catalog/index.html")
    context = {
        "page_title": "Home",
    }
    return HttpResponse(template.render(context, request))


def admin(request):
    context = {
        "page_title": "Administration",
        "page_script": "js/admin.js",
        "page_header": "Espace d'administration du catalogue",
    }
    if not request.user.is_authenticated:
        return redirect('login.html')
    product_id = request.GET.get('id', None)

    if request.method == 'POST':
        if product_id is None:
            product = Product()
            context['page_information'] = 'Produit crée'
        else:
            product = Product.objects.get(id=product_id)
            context["page_information"] = 'Produit mis à jour'

        product.name = request.POST['product_name']
        product.description = request.POST['product_desc']
        product.category_id = request.POST['product_cat_id']
        product.price = request.POST['product_price']
        product.enabled = 'product_enabled' in request.POST

        if 'product_img_name' in request.FILES:
            file = request.FILES['product_img_name']
            product.picture = file

        product.save()

        Discount.objects.filter(product_id=product_id).delete()
        if 'product_discount' in request.POST:

            try:
                discount = Discount(
                    value=float(request.POST['product_discount_value']),
                    product_id=product_id,
                    start_date=make_aware(datetime.strptime(
                        request.POST['product_discount_start'], '%Y-%m-%d')),
                    end_date=make_aware(datetime.strptime(
                        request.POST['product_discount_end'], '%Y-%m-%d')),
                    enabled=True)
                discount.save()
            except:
                pass

    template = loader.get_template("catalog/admin.html")
    return HttpResponse(template.render(context, request))


def catalog(request):
    template = loader.get_template("catalog/catalog.html")
    context = {
        "page_title": "Catalogue",
        "page_script": "js/catalog.js",
        "page_header": "Catalogue",
    }
    return HttpResponse(template.render(context, request))


def logout_user(request):
    logout(request)
    return redirect('/')


def login_user(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('admin.html')
        return redirect('login.html')

    template = loader.get_template("catalog/login.html")
    context = {
        "page_title": "Connexion",
        "page_header": "Connexion",
    }
    return HttpResponse(template.render(context, request))


###############################################################################
######################## JSON API #############################################
###############################################################################


def delete(request, id):
    to_delete = Product.objects.get(id=id)
    if to_delete is not None:
        to_delete.delete()
        return JsonResponse({'result': True})
    return JsonResponse({'result': False})


def product_json(request):
    product_id = request.GET.get('id', None)
    product = Product.objects.get(pk=product_id)
    return JsonResponse({'product': product.desc()})


def catalog_json(request):
    all_products = request.GET.get('all', None)
    cat_filter = request.GET.get('cat', None)
    only_discounts = request.GET.get('discounts', None)

    active_products = Product.objects.all()

    # Filtrer par catégorie
    if cat_filter is not None and cat_filter !="":
        cat_filter = [int(c) for c in cat_filter.split(',')]
        active_products = active_products.filter(category_id__in=cat_filter)

    # Seulement les promos
    if only_discounts is not None and only_discounts.lower() in ['1', 'true']:
        all_discounts = Discount.objects.all()
        active_products = active_products.filter(
            id__in=[d.product_id for d in all_discounts])

    # Filtrer seulement les produts actifs
    if all_products is not None and all_products.lower() in ['1', 'true']:
        active_products = active_products.filter(enabled=True)

    active_products = [p.desc() for p in active_products]
    return JsonResponse({'products': active_products})


def categories_json(request):
    all_categories = ProductCategory.objects.all().order_by('name')
    all_categories = [c.desc() for c in all_categories]
    return JsonResponse({'categories': all_categories})

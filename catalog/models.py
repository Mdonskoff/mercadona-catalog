from django.db import models


class ProductCategory(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    def desc(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.FloatField()
    picture = models.ImageField(upload_to="product_images")
    enabled = models.BooleanField()

    def __str__(self):
        return f"{self.name} [{self.enabled}]"

    def get_active_discount(self):
        from django.utils import timezone
        discounts = Discount.objects.filter(
            product_id=self.id,
            enabled=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).order_by('value')[:1]
        if len(discounts):
            return discounts[0]
        return None

    def desc(self):
        result = {
            'id': self.id,
            'category': self.category_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'discount': None,
            'enabled': self.enabled,
        }

        if self.picture:
            result['picture'] = self.picture.url
        else:
            result['picture'] = None

        discount = self.get_active_discount()
        if discount is not None:
            result['discount'] = {
                'value': discount.value,
                'start_date': discount.start_date.strftime("%Y-%m-%d"),
                'end_date': discount.end_date.strftime("%Y-%m-%d"),
                'price': self.price * (1.0 - discount.value),
            }

        return result


class Discount(models.Model):
    value = models.FloatField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    enabled = models.BooleanField()

    def __str__(self):
        percentage = self.value * 100.0
        return f"{percentage}% [{self.enabled}]"

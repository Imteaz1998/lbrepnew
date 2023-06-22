from django.contrib import admin
from listings.models import Listing, Poi
from .forms import PoisForm


class PoiAdmin(admin.ModelAdmin):
    form = PoisForm


# Register your models here.
admin.site.register(Listing)
admin.site.register(Poi, PoiAdmin)

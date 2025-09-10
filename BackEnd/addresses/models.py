# addresses/models.py
from django.db import models

class Province(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class CityMunicipality(models.Model):
    name = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10, blank=True)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name

class Address(models.Model):
    street = models.CharField(max_length=200)
    barangay = models.CharField(max_length=100)
    city_municipality = models.ForeignKey(CityMunicipality, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.street}, {self.barangay}, {self.city_municipality.name}"
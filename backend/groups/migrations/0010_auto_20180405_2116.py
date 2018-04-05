# Generated by Django 2.0.3 on 2018-04-05 21:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0009_auto_20180404_1253'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('term', models.CharField(max_length=255)),
                ('year', models.CharField(max_length=255)),
            ],
        ),
        migrations.AlterField(
            model_name='group',
            name='owner',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='membership',
            name='group_id',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='groups.Group'),
        ),
    ]

# Generated by Django 3.1.7 on 2021-03-30 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskapp', '0004_auto_20210330_1740'),
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.UUIDField(auto_created=True, editable=False, primary_key=True, serialize=False)),
                ('expires', models.DateTimeField()),
            ],
        ),
    ]

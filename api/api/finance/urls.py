from django.urls import path

# from . import views

# app_name = "countings"
# urlpatterns = [
#     path("filters/", views.plot_filter_options, name="filters"),
#     path("plot/lid/<int:lid>/year/<int:year>/", views.plot_location_year, name="plot-location-year"),
#     path("plot/gid/<int:gid>/year/<int:year>/", views.plot_group_year, name="plot-group-year"),
#     path("plot/rid/<int:rid>/year/<int:year>/", views.plot_region_year, name="plot-region-year"),
#     path("plot/csid/<int:csid>/year/<int:year>/", views.plot_country_state_year, name="plot-country-state"),
#     path("plot/zid/<int:zid>/year/<int:year>/", views.plot_zone_year, name="plot-zone-year"),
#     path('highest/compute/lid/<int:lid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.location_highest_compute, name='location-highest-compute'),
#     path('highest/compute/gid/<int:gid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.group_highest_compute, name='group-highest-compute'),
#     path('highest/compute/rid/<int:rid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.region_highest_compute, name='region-highest-compute'),
#     path('highest/compute/csid/<int:csid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.countrystate_highest_compute, name='countrystate-highest-compute'),
#     path('highest/compute/zid/<int:zid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.zone_highest_compute, name='zone-highest-attendance'),
#     path('totals/compute/lid/<int:lid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.location_totals_compute, name='location-totals-compute'),
#     path('totals/compute/gid/<int:gid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.group_totals_compute, name='group-totals-compute'),
#     path('totals/compute/rid/<int:rid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.region_totals_compute, name='region-totals-compute'),
#     path('totals/compute/csid/<int:csid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.countrystate_totals_compute, name='countrystate-totals-compute'),
#     path('totals/compute/zid/<int:zid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/', views.zone_totals_compute, name='zone-totals-compute'),
#     path("highest/export/lid/<int:lid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.location_highest_export, name='location-highest-export'),
#     path("highest/export/gid/<int:gid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.group_highest_export, name='group-highest-export'),
#     path("highest/export/rid/<int:rid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.region_highest_export, name='region-highest-export'),
#     path("highest/export/csid/<int:csid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.countrystate_highest_export, name='countrystate-highest-export'),
#     path("highest/export/zid/<int:zid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.zone_highest_export, name='zone-highest-export'),
#     path("totals/export/lid/<int:lid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.location_totals_export, name='location-totals-export'),
#     path("totals/export/gid/<int:gid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.group_totals_export, name='group-totals-export'),
#     path("totals/export/rid/<int:rid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.region_totals_export, name='region-totals-export'),
#     path("totals/export/csid/<int:csid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.countrystate_totals_export, name='countrystate-totals-export'),
#     path("totals/export/zid/<int:zid>/mtg/<int:mtg>/sdate/<sdate>/edate/<edate>/", views.zone_totals_export, name='zone-totals-export'),
#     path("export/json/", views.export_json, name='export-json'),
#     path("import/json/", views.import_json, name='import-json'),
#     path("import/excel/", views.import_excel, name='import-excel'),
# ]

from import_export import resources
from import_export.fields import Field
from import_export.widgets import DateTimeWidget
from .models import Account, Transaction


class TransactionResource(resources.ModelResource):
    created_at = Field(attribute='created_at', column_name='created_at', widget=DateTimeWidget('%Y-%m-%d %H:%M:%S'))
    
    class Meta:
        model = Transaction
        # fields = ('id','men','women','youth_boys','youth_girls','children_boys','children_girls',
        #     'specials_one','specials_two','meeting_date', 
        #     'created_at','meeting','location','grouping','region','country_state','zone','sender',)
        skip_unchanged = True
        use_bulk=True
        # raise_errors=True
        
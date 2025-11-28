from django.db.backends.signals import connection_created
from django.dispatch import receiver

@receiver(connection_created)
def configure_sqlite_pragmas(sender, connection, **kwargs):
    """
    Enable WAL mode and lower sync overhead on every connection.
    """
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        
        # WAL = Write-Ahead Logging
        # Allows concurrent readers and writers 
        cursor.execute('PRAGMA journal_mode=WAL;')
        
        # NORMAL = Less aggressive flushing to disk
        # Safe for app crashes, riskier for full OS crashes (rare)
        # 10x faster writes
        cursor.execute('PRAGMA synchronous=NORMAL;')
        
        # Increase cache size (use negative number for kilobytes)
        # -64000 = ~64MB of RAM cache
        cursor.execute('PRAGMA cache_size=-64000;')
        
        # Store temporary tables in RAM, not disk
        cursor.execute('PRAGMA temp_store=MEMORY;')
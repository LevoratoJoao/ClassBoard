import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.init_db import debug_database, reset_database

if __name__ == "__main__":
    print("Testing database connection...")
    debug_database()
    
    choice = input("\nOptions:\n1. Reset database\n2. Exit\nChoice: ")
    if choice == "1":
        reset_database()
        debug_database()

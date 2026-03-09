import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
import threading

# Simple JSON-based storage with thread safety
class JSONDatabase:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.lock = threading.Lock()
    
    def get_file_path(self, table: str) -> Path:
        return self.data_dir / f"{table}.json"
    
    def _read_file(self, table: str) -> Dict[str, Any]:
        """Read JSON file safely"""
        file_path = self.get_file_path(table)
        if not file_path.exists():
            return {}
        
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}
    
    def _write_file(self, table: str, data: Dict[str, Any]):
        """Write JSON file safely"""
        file_path = self.get_file_path(table)
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    def insert(self, table: str, id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert or update a record"""
        with self.lock:
            db = self._read_file(table)
            data['id'] = id
            db[id] = data
            self._write_file(table, db)
            return data
    
    def get(self, table: str, id: str) -> Optional[Dict[str, Any]]:
        """Get a record by ID"""
        with self.lock:
            db = self._read_file(table)
            return db.get(id)
    
    def get_all(self, table: str) -> List[Dict[str, Any]]:
        """Get all records"""
        with self.lock:
            db = self._read_file(table)
            return list(db.values())
    
    def delete(self, table: str, id: str) -> bool:
        """Delete a record"""
        with self.lock:
            db = self._read_file(table)
            if id in db:
                del db[id]
                self._write_file(table, db)
                return True
            return False
    
    def find(self, table: str, **filters) -> List[Dict[str, Any]]:
        """Find records matching filters"""
        with self.lock:
            db = self._read_file(table)
            results = []
            for record in db.values():
                match = True
                for key, value in filters.items():
                    if record.get(key) != value:
                        match = False
                        break
                if match:
                    results.append(record)
            return results

# -*- coding: utf-8 -*-
import os

def write(path, content):
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[OK] Wrote {path}')

print('Initialized full_build.py')

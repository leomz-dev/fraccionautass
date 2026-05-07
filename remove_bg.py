import os
import io
from rembg import remove
from PIL import Image

def process_image(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'rb') as i:
            input_data = i.read()
        
        output_data = remove(input_data)
        
        with open(filepath, 'wb') as o:
            o.write(output_data)
        print(f"Successfully processed {filepath}")
    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

if __name__ == "__main__":
    files = [
        "public/assets/alien_pizza.png",
        "public/assets/mascot_robot.png",
        "public/assets/meteorite.png"
    ]
    for f in files:
        if os.path.exists(f):
            process_image(f)
        else:
            print(f"File not found: {f}")

import os
import argparse
from PIL import Image

print("DEBUG: Script started")

def convert_to_design_asset(source_dir, output_dir, target_format='PNG', quality=95):
    """
    Converts images (WebP, etc.) to design-ready assets (PNG/JPEG).
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output directory: {output_dir}")

    supported_extensions = ('.webp', '.jpeg', '.jpg', '.png', '.bmp', '.tiff')

    files = [f for f in os.listdir(source_dir) if f.lower().endswith(supported_extensions)]

    if not files:
        print(f"No supported image files found in {source_dir}")
        return

    print(f"Found {len(files)} files to convert.")

    for filename in files:
        try:
            input_path = os.path.join(source_dir, filename)

            # Remove extension and append new one
            name_without_ext = os.path.splitext(filename)[0]
            output_extension = target_format.lower()
            if output_extension == 'jpeg':
                output_extension = 'jpg'

            output_filename = f"{name_without_ext}.{output_extension}"
            output_path = os.path.join(output_dir, output_filename)

            with Image.open(input_path) as img:
                # Convert to RGB if saving as JPEG (removes alpha channel)
                if target_format.upper() == 'JPEG' and img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')

                # PNG is best for high-fidelity design assets
                if target_format.upper() == 'PNG':
                    img.save(output_path, 'PNG', optimize=True)
                else:
                    img.save(output_path, 'JPEG', quality=quality)

                print(f"Successfully converted: {filename} -> {output_filename}")

        except Exception as e:
            print(f"Error converting {filename}: {str(e)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert web images to design assets.")
    parser.add_argument("--source", default="/Users/okgoogle13/Desktop/[DEPRECATED_STYLE] images phase 2", help="Source directory")
    parser.add_argument("--output", default="/Users/okgoogle13/Desktop/[DEPRECATED_STYLE] design assets", help="Output directory")
    parser.add_argument("--format", default="PNG", choices=["PNG", "JPEG"], help="Target format")

    args = parser.parse_args()

    convert_to_design_asset(args.source, args.output, args.format)

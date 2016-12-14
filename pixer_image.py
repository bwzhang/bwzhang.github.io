import json
import sys
from PIL import Image

def main():
    if len(sys.argv) < 4:
        print "Too few arguments passed"
        return
    filename = sys.argv[1]
    width = int(sys.argv[2])
    height = int(sys.argv[3])
    if len(sys.argv) > 4:
        set_value = True
    im = Image.open(filename).convert('L').resize((width, height))
    pixels = list(im.getdata())
    pixer_coords = []
    threshold = 150
    for y in xrange(height):
        for x in xrange(width):
            idx = width * y + x
            val = pixels[idx] if set_value else 1
            if val < threshold:
                pixer_coords.append({'x': x, 'y': y, 'value': 255 - val})
    name, _ = filename.split('.', 1)
    with open(name + '.js', 'w') as f:
        f.write('var ' + name + ' = ' + json.dumps(pixer_coords))

if __name__ == '__main__':
    main()

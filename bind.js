// Global
__GRAPHICS_COL = 255 << 16 | 255 << 8 | 255;

// Constants
c_white = 255 << 16 | 255 << 8 | 255;
c_black = 0;
c_red = 255;
c_blue = 255 << 8;
c_green = 255 << 16;
vk_space = 32;
vk_left = 37;
vk_up = 38;
vk_right = 39;
vk_down = 40;

// Functions
function sprite_create(name, properties, override=false) {
    if (Silk.Resources.Sprites[name] == undefined || override == true) {
        Silk.Resources.Sprites[name] = {
            Name: name,
            Loaded: false,
            Asset: new Image(),
            Size: {x: 0, y: 0},
            Image: properties.Image || "",
            Frames: properties.Frames || 1,
            Origin: properties.Origin || {x: 0, y: 0},
            Bounds: properties.Bounds || [0, 0, 0, 0]
        };
        Silk.Resources.Sprites[name].Asset.src = Silk.Resources.Sprites[name].Image;
        Silk.Resources.Sprites[name].Asset.onload = function(e) {
            let Asset = Silk.Resources.Sprites[name];
            Asset.Loaded = true;
            Asset.Size = {
                x: this.width / Asset.Frames,
                y: this.height / Asset.Frames
            };

        }
        window[name] = name;
    }
}

function object_create(name, properties, override=false) {
    if (Silk.Resources.Objects[name] == undefined || override == true) {
        Silk.Resources.Objects[name] = {
            Name: name,
            Persistent: properties.Persistent || false,
            Create: properties.Create,
            Update: properties.Update,
            Render: properties.Render
        };
        window[name] = name;
    }
}

function room_create(name, properties={}, override=false) {
    if (Silk.Resources.Rooms[name] == undefined || override == true) {
        Silk.Resources.Rooms[name] = {
            Colour: properties.Colour || properties.Color || c_white,
            Creation: properties.Creation
        };
        Silk.Resources.Rooms[name].Colour = `rgb(${Silk.Resources.Rooms[name].Colour & 255}, ${(Silk.Resources.Rooms[name].Colour >> 16) & 255}, ${(Silk.Resources.Rooms[name].Colour >> 8) & 255})`
        window[name] = name;
    }
}

function room_goto(name) {
    if (Silk.Resources.Rooms[name] != undefined) {
        for(var i = 0; i < Silk.Core.Instances.length; i++) {
            if (Silk.Core.Instances[i].Persistent == false) {
                delete Silk.Core.Instances[i];
                Silk.Core.Instances.splice(i--, 1);
            }
        }

        if (Silk.Resources.Rooms[name].Creation != undefined) {
            Silk.Resources.Rooms[name].Creation();
        }
    }
}

function instance_create(x, y, object) {
    if (Silk.Resources.Objects[object] != undefined) {
        Silk.Core.Instances.push(Object.assign({
            Create: undefined,
            Update: undefined,
            Render: undefined,
            x: x,
            y: y
        }, Silk.Resources.Objects[object]));
        return Silk.Core.Instances[Silk.Core.Instances.length - 1];
    }
    return undefined;
}

function instance_find(object, index) {
    let Index = 0;
    for(var i = 0; i < Silk.Core.Instances.length; i++) {
        let Instance = Silk.Core.Instances[i];
        if (Instance.Name == object && Index++ == index) {
            return Instance;
        }
    }
    return undefined;
}

function instance_destroy(ref) {

}

function draw_sprite(sprite, index, x, y) {
    if (Silk.Resources.Sprites[sprite] != undefined) {
        let Sprite = Silk.Resources.Sprites[sprite];
        Silk.Graphics.Context.drawImage(Sprite.Asset, Sprite.Size.x * (index % Sprite.Frames), 0, Sprite.Size.x, Sprite.Size.y, x - Sprite.Origin.x, y - Sprite.Origin.y, Sprite.Size.x, Sprite.Size.y);
    }
}

function draw_set_colour(col) {
    Silk.Graphics.Colour = `rgb(${col & 255}, ${(col >> 16) & 255}, ${(col >> 8) & 255})`;
    Silk.Graphics.Context.fillStyle = Silk.Graphics.Colour;
    Silk.Graphics.Context.strokeStyle = Silk.Graphics.Colour;
}
draw_set_color = draw_set_colour;

function draw_rectangle(x1, y1, x2, y2, outline) {
    Silk.Graphics.Context.beginPath();
    Silk.Graphics.Context.rect(x1, y1, x2 - x1, y2 - y1);
    (outline ? Silk.Graphics.Context.stroke() : Silk.Graphics.Context.fill());
}

function ord(key) {
    return key.charCodeAt(0);
}

function keyboard_check(key) {
    return Silk.Input.Get(key);
}
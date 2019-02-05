// Engine
Silk = {
    Initalize: function(e) {
        if (e != null) {
            Silk.Graphics.Target = e;
            Silk.Graphics.Context = Silk.Graphics.Target.getContext("2d");
            Silk.Graphics.Target.addEventListener("focus", function() { this.style.outline = "none"; });
            Silk.Core.Create();
            Silk.Input.Create();
        }
    },
    Resources: {
        Objects: {},
        Sprites: {},
        Rooms: {}
    },
    Core: {
        Instances: [],
        Timestamp: 0,
        Framerate: 1000 / 60,
        Create: function() {
            for(Room in Silk.Resources.Rooms) {
                Silk.Graphics.Clear = Silk.Resources.Rooms[Room].Colour;
                if (Silk.Resources.Rooms[Room].Creation != undefined) {
                    Silk.Resources.Rooms[Room].Creation();
                }
                break;
            }
            window.requestAnimationFrame(Silk.Core.Update);
        },
        Update: function(t) {
            if ((t - Silk.Core.Timestamp) >= Silk.Core.Framerate) {
                Silk.Core.Timestamp = t;
                Silk.Input.Update();
                Silk.Core.Instances.forEach(Instance => {
                    if (Instance.Update != undefined) {
                        Instance.Update(Instance);
                    }
                });
                Silk.Graphics.Update();
                document.getElementById("debug").innerHTML = JSON.stringify(Silk.Input.Keys);
            } else {
                window.requestAnimationFrame(Silk.Core.Update);
            }
        }
    },
    Graphics: {
        Target: undefined,
        Context: undefined,
        Clear: "rgb(255, 255, 255)",
        Colour: "rgb(255, 255, 255)",
        Update: function() {
            Silk.Graphics.Context.fillStyle = Silk.Graphics.Clear;
            Silk.Graphics.Context.fillRect(0, 0, Silk.Graphics.Target.width, Silk.Graphics.Target.height);
            Silk.Graphics.Context.fillStyle = Silk.Graphics.Colour;
            Silk.Graphics.Context.strokeStyle = Silk.Graphics.Colour;
            Silk.Core.Instances.forEach(Instance => {
                if (Instance.Render != undefined) {
                    Instance.Render(Instance);
                }
            });
            window.requestAnimationFrame(Silk.Core.Update);
        }
    },
    Input: {
        Keys: {},
        Create: function() {
            Silk.Graphics.Target.addEventListener("keydown", function(e) {
                e.preventDefault();
                if ((e.keyCode in Silk.Input.Keys) == false) {
                    Silk.Input.Keys[e.keyCode] = 0;
                }
            });

            Silk.Graphics.Target.addEventListener("keyup", function(e) {
                e.preventDefault();
                Silk.Input.Keys[e.keyCode] = 2;
            });
        },
        Update: function() {
            for(let Key in Silk.Input.Keys) {
                switch (Silk.Input.Keys[Key]) {
                    case 0: {
                        Silk.Input.Keys[Key] = 1;
                        break;
                    }

                    case 2: {
                        delete Silk.Input.Keys[Key];
                        break;
                    }
                }
            }
        },
        Get: function(key) {
            return (key in Silk.Input.Keys);
        },
        GetPressed: function(key) {
            return ((key in Silk.Input.Keys) && (Silk.Input.Keys[key] == 0));
        },
        GetReleased: function(key) {
            return ((key in Silk.Input.Keys) && (Silk.Input.Keys[key] == 2));
        },
    }
}
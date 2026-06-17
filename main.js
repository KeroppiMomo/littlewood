const canvasSize = Math.min(window.innerWidth / 2, (window.innerHeight - 150)/2) - 30;

//
// Shared application state
//
const state = {
    pointX: -0.290,
    pointY: -0.613,
};

//
// Canvas 1
// Background image + draggable point
//
const sketch1 = (p) => {

    let bgImage;

    const W = canvasSize;
    const H = canvasSize;

    const imageSize = 0.9;

    let dragging = false;
    const crossRadius = 0.05;

    function setCaption() {
        document.getElementById("coordsCaption").innerHTML = `z = (${state.pointX.toFixed(3)}, ${state.pointY.toFixed(3)})`;
    }

    p.preload = () => {
        bgImage = p.loadImage("selector.png");
    };

    p.setup = () => {
        p.createCanvas(W, H);

        setCaption();
    };

    p.draw = () => {

        p.background(240);

        p.push()
        p.translate(W, 0);
        p.scale(W / imageSize, H / -imageSize);

        if (bgImage) {
            p.push();
            p.scale(1, -1);
            p.image(bgImage, -imageSize, 0, imageSize, imageSize);
            p.pop();
        }

        // Draw selected point
        p.stroke(255);
        p.strokeWeight(0.01);

        p.line(state.pointX - crossRadius, state.pointY - crossRadius, state.pointX + crossRadius, state.pointY + crossRadius);
        p.line(state.pointX - crossRadius, state.pointY + crossRadius, state.pointX + crossRadius, state.pointY - crossRadius);

        p.pop()
    };

    p.mousePressed = () => {
        p.push();

        const d = p.dist(
            -(1 - p.mouseX/W)*imageSize,
            -p.mouseY/H*imageSize,
            state.pointX,
            state.pointY
        );

        if (d < crossRadius * 2) {
            dragging = true;
        }

        p.pop();
    };

    p.mouseDragged = () => {
        if (!dragging) return;

        state.pointX = -(1 - p.constrain(p.mouseX, 0, W)/W) * imageSize;
        state.pointY = -p.constrain(p.mouseY, 0, H)/H * imageSize;

        const norm = Math.sqrt(state.pointX * state.pointX + state.pointY * state.pointY);
        if (norm > 0.78) {
            state.pointX *= 0.78 / norm;
            state.pointY *= 0.78 / norm;
        }

        setCaption();
    };

    p.mouseReleased = () => {
        dragging = false;
    };
};

const sketch2 = (p) => {
    let bgImage;
    let image;

    const W = canvasSize;
    const H = canvasSize;

    const imageSize = 0.78;
    const bgImageSize = 0.9;
    const scale = 0.075;

    const crossRadius = 0.05/0.9*scale;

    let lastX = null;
    let lastY = null;

    p.preload = () => {
        bgImage = p.loadImage("selector.png");
        image = p.loadImage("close2.png");
    };

    p.setup = () => {
        p.createCanvas(W, H);
    };

    p.draw = () => {
        if (state.pointX == lastX && state.pointY == lastY) {
            return;
        }
        p.background(0);

        p.push()
        p.translate(W, 0);
        p.scale(W, -H);
        p.scale(1/scale, 1/scale);
        p.translate(
            -state.pointX - scale / 2,
            -state.pointY - scale / 2
        );

        if (image) {
            p.push();
            p.scale(1, -1);
            p.image(image, -imageSize, 0, imageSize, imageSize);
            p.pop();
        }
        //
        // // Draw selected point
        p.stroke(255);
        p.strokeWeight(0.0007);

        p.line(state.pointX - crossRadius, state.pointY - crossRadius, state.pointX + crossRadius, state.pointY + crossRadius);
        p.line(state.pointX - crossRadius, state.pointY + crossRadius, state.pointX + crossRadius, state.pointY - crossRadius);

        p.pop();
    }
};

//
// Canvas 3
// Another visualization
//
const sketch3 = (p) => {
    const W = canvasSize;
    const H = canvasSize;

    let lastX = null;
    let lastY = null;

    p.setup = () => {
        p.createCanvas(W, H);
    };

    p.draw = () => {
        if (state.pointX != lastX || state.pointY != lastY) {
            p.background(0);
            lastX = state.pointX;
            lastY = state.pointY;
        }

        p.push();
        p.translate(W/2, H/2);
        p.scale(W/2, -H/2);
        p.scale(1/3);

        p.strokeWeight(0.01);
        p.stroke(255, 100);
        const time = Date.now();
        while (Date.now() - time < 1000/60) { // Aim for 60 fps
            for (let n=0; n<100; ++n) {
                let x = 0;
                let y = 0;

                for (let k=0; k<30; ++k) {
                    const sign = Math.round(Math.random()) * 2 - 1
                    const newx = sign + (state.pointX * x - state.pointY * y);
                    const newy = (state.pointX * y + state.pointY * x);
                    x = newx; y = newy;
                }

                p.point(x, y);
            }
        }
        p.pop();
    };
};

//
// Create p5 instances
//
new p5(sketch1, "canvas1");
new p5(sketch2, "canvas2");
new p5(sketch3, "canvas3");

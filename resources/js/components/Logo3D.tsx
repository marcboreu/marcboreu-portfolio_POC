import { useEffect, useRef } from "react";
import classNames from "classnames";
import {
  SRGBColorSpace,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  DirectionalLight,
  AmbientLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  Color,
  Box3,
  Vector3,
  ExtrudeGeometry,
  DoubleSide,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { Transition } from "react-transition-group";
import { useTheme } from "components/ThemeProvider/index.jsx";
import {
  usePrefersReducedMotion,
  useInViewport,
  useWindowSize,
} from "hooks/index.js";
import { reflow } from "utils/transition.js";
import { rgbToThreeColor } from "utils/style.js";
import { cleanScene, removeLights, cleanRenderer } from "utils/three.js";
import "./index.css";

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 351 351">
<g fill="black" fill-rule="evenodd">
<path d="M 173.00 349.50 L 163.00 348.50 L 156.00 344.50 L 150.50 339.00 L 145.00 333.50 L 139.50 328.00 L 134.00 322.50 L 128.50 317.00 L 123.00 311.50 L 117.50 306.00 L 112.00 300.50 L 106.50 295.00 L 101.00 289.50 L 95.50 284.00 L 90.00 278.50 L 84.50 273.00 L 79.00 267.50 L 73.50 262.00 L 68.00 256.50 L 62.50 251.00 L 57.00 245.50 L 51.50 240.00 L 46.00 234.50 L 40.50 229.00 L 35.00 223.50 L 29.50 218.00 L 24.00 212.50 L 18.50 207.00 L 13.00 201.50 L 7.50 196.00 L 15.00 194.50 L 26.00 194.50 L 37.00 194.50 L 48.00 194.50 L 59.00 194.50 L 70.00 194.50 L 81.00 194.50 L 92.00 194.50 L 99.00 198.50 L 104.50 204.00 L 110.00 209.50 L 115.50 215.00 L 121.00 220.50 L 126.50 226.00 L 132.00 231.50 L 137.50 237.00 L 143.00 242.50 L 148.50 248.00 L 154.00 253.50 L 159.50 259.00 L 165.00 264.50 L 171.50 268.00 L 177.00 262.50 L 182.50 257.00 L 188.00 251.50 L 193.50 246.00 L 199.00 240.50 L 204.50 235.00 L 210.00 229.50 L 215.50 224.00 L 221.00 218.50 L 226.50 213.00 L 232.00 207.50 L 237.50 202.00 L 243.00 196.50 L 248.50 191.00 L 254.00 185.50 L 256.00 179.50 L 249.00 183.50 L 242.00 187.50 L 235.00 191.50 L 228.00 195.50 L 221.00 199.50 L 214.00 203.50 L 207.00 207.50 L 200.00 211.50 L 193.00 215.50 L 186.00 219.50 L 179.00 223.50 L 169.50 224.00 L 162.00 220.50 L 156.00 215.50 L 150.50 210.00 L 145.00 204.50 L 139.50 199.00 L 134.00 193.50 L 128.50 188.00 L 123.00 182.50 L 119.50 175.00 L 121.50 166.00 L 125.00 158.50 L 129.00 151.50 L 133.50 145.00 L 137.50 138.00 L 141.50 131.00 L 145.50 124.00 L 149.50 117.00 L 154.00 110.50 L 158.00 103.50 L 162.50 97.00 L 166.50 90.00 L 165.50 85.00 L 160.00 90.50 L 154.50 96.00 L 149.00 101.50 L 143.50 107.00 L 138.00 112.50 L 132.50 118.00 L 127.00 123.50 L 121.50 129.00 L 116.00 134.50 L 110.50 140.00 L 105.00 145.50 L 99.50 151.00 L 90.00 152.50 L 79.00 152.50 L 68.00 152.50 L 57.00 152.50 L 46.00 152.50 L 35.00 152.50 L 24.00 152.50 L 13.00 152.50 L 14.50 148.00 L 20.00 142.50 L 25.50 137.00 L 31.00 131.50 L 36.50 126.00 L 41.50 120.00 L 47.00 114.50 L 52.50 109.00 L 58.00 103.50 L 63.50 98.00 L 69.00 92.50 L 74.50 87.00 L 80.00 81.50 L 85.50 76.00 L 91.00 70.50 L 96.50 65.00 L 101.50 59.00 L 107.00 53.50 L 112.50 48.00 L 118.00 42.50 L 123.50 37.00 L 129.00 31.50 L 134.50 26.00 L 140.00 20.50 L 145.50 15.00 L 151.00 9.50 L 156.50 4.00 L 164.00 0.50 L 174.00 1.50 L 181.50 5.00 L 187.50 10.00 L 193.00 15.50 L 198.50 21.00 L 204.00 26.50 L 209.50 32.00 L 214.50 38.00 L 220.00 43.50 L 225.50 49.00 L 231.00 54.50 L 236.50 60.00 L 241.50 66.00 L 244.00 74.50 L 242.50 83.00 L 239.50 91.00 L 235.00 97.50 L 230.00 103.50 L 225.00 109.50 L 220.00 115.50 L 215.50 122.00 L 210.50 128.00 L 205.50 134.00 L 200.50 140.00 L 196.50 147.00 L 203.00 143.50 L 209.50 139.00 L 215.50 134.00 L 221.50 129.00 L 227.50 124.00 L 234.00 119.50 L 240.00 114.50 L 246.00 109.50 L 252.00 104.50 L 259.00 100.50 L 268.00 98.50 L 276.50 101.00 L 283.00 105.50 L 288.50 111.00 L 294.00 116.50 L 299.50 122.00 L 305.00 127.50 L 310.00 133.50 L 315.50 139.00 L 321.00 144.50 L 326.50 150.00 L 332.00 155.50 L 337.50 161.00 L 342.00 167.50 L 343.00 176.50 L 340.00 184.50 L 335.50 191.00 L 330.00 196.50 L 324.50 202.00 L 319.00 207.50 L 313.50 213.00 L 308.00 218.50 L 302.50 224.00 L 297.00 229.50 L 291.50 235.00 L 286.00 240.50 L 280.50 246.00 L 275.00 251.50 L 269.50 257.00 L 264.00 262.50 L 258.50 268.00 L 253.00 273.50 L 247.50 279.00 L 242.00 284.50 L 236.50 290.00 L 231.00 295.50 L 225.50 301.00 L 220.00 306.50 L 214.50 312.00 L 209.00 317.50 L 203.50 323.00 L 198.00 328.50 L 192.50 334.00 L 187.00 339.50 L 181.50 345.00 L 174.00 348.50 Z"/>
</g></svg>`;

const Logo3D = (props) => {
  const theme = useTheme();
  const { rgbBackground, themeId, colorWhite } = theme;

  const container = useRef();
  const nodeRef = useRef(null);
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef();

  const anchorGroup = useRef();
  const tiltGroup = useRef();

  const logoBaseSize = useRef();
  const basePosition = useRef(new Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: Math.PI, y: 0, z: 0 });

  const prefersReducedMotion = usePrefersReducedMotion();
  const isInViewport = useInViewport(container);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (!container.current) return;

    const bounds = container.current.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);

    try {
      renderer.current = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error("renderer FAILED", error);
      renderer.current = null;
      return;
    }

    const canvas = renderer.current.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    container.current.innerHTML = "";
    container.current.appendChild(canvas);

    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.current.setSize(width, height, false);
    renderer.current.outputColorSpace = SRGBColorSpace;

    camera.current = new PerspectiveCamera(42, width / height, 0.1, 500);
    camera.current.position.z = 120;
    camera.current.lookAt(0, 0, 0);

    scene.current = new Scene();
    anchorGroup.current = new Group();
    tiltGroup.current = new Group();

    const loader = new SVGLoader();
    const data = loader.parse(logoSvg);

    const front = new MeshStandardMaterial({
      color: new Color(themeId === "light" ? 0x101010 : 0xf3f3f3),
      metalness: 0.18,
      roughness: 0.42,
      side: DoubleSide,
    });

    const side = new MeshStandardMaterial({
      color: new Color(themeId === "light" ? 0x2c2c2c : 0xd8d8d8),
      metalness: 0.08,
      roughness: 0.68,
      side: DoubleSide,
    });

    data.paths.forEach((path) => {
      const shapes = path.toShapes(true);

      shapes.forEach((shape) => {
        const geometry = new ExtrudeGeometry(shape, {
          depth: 10,
          bevelEnabled: false,
        });

        geometry.computeBoundingBox();

        const mesh = new Mesh(geometry, [front, side]);
        mesh.frustumCulled = false;
        tiltGroup.current.add(mesh);
      });
    });

    const box = new Box3().setFromObject(tiltGroup.current);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());

    logoBaseSize.current = size.clone();
    tiltGroup.current.position.sub(center);
    tiltGroup.current.scale.setScalar(0.08);
    tiltGroup.current.rotation.set(Math.PI, 0, 0);

    currentRotation.current = { x: Math.PI, y: 0, z: 0 };

    anchorGroup.current.position.set(0, 0, 0);
    anchorGroup.current.add(tiltGroup.current);
    scene.current.add(anchorGroup.current);

    const amb = new AmbientLight(0xffffff, 2);
    scene.current.add(amb);

    renderer.current.render(scene.current, camera.current);

    return () => {
      if (renderer.current) renderer.current.setAnimationLoop(null);
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
      if (container.current) container.current.innerHTML = "";
      renderer.current = null;
      camera.current = null;
      scene.current = null;
      anchorGroup.current = null;
      tiltGroup.current = null;
      logoBaseSize.current = null;
    };
  }, [themeId]);

  useEffect(() => {
    if (!scene.current) return;

    const key = new DirectionalLight(
      colorWhite,
      themeId === "light" ? 2.8 : 2.1,
    );
    const fill = new DirectionalLight(
      colorWhite,
      themeId === "light" ? 1.0 : 0.8,
    );
    const amb = new AmbientLight(colorWhite, themeId === "light" ? 1.2 : 0.5);

    key.position.set(30, 40, 50);
    fill.position.set(-20, -10, 30);

    lights.current = [key, fill, amb];
    scene.current.background = new Color(...rgbToThreeColor(rgbBackground));
    lights.current.forEach((light) => scene.current.add(light));

    return () => removeLights(lights.current);
  }, [rgbBackground, colorWhite, themeId]);

  useEffect(() => {
    if (!container.current || prefersReducedMotion) return;

    const handlePointerMove = (event) => {
      const rect = container.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      pointer.current.x = Math.max(-1, Math.min(1, x));
      pointer.current.y = Math.max(-1, Math.min(1, y));
    };

    const handlePointerLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (
      !anchorGroup.current ||
      !tiltGroup.current ||
      !logoBaseSize.current ||
      !renderer.current ||
      !camera.current ||
      !scene.current ||
      !container.current
    ) {
      return;
    }

    const bounds = container.current.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);

    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.current.setSize(width, height, false);
    camera.current.aspect = width / height;
    camera.current.updateProjectionMatrix();
    camera.current.lookAt(0, 0, 0);

    const distance = camera.current.position.z;
    const vFov = (camera.current.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
    const visibleWidth = visibleHeight * camera.current.aspect;
    const aspectRatio = width / height;

    const viewportMetric = Math.min(width * 0.7 + height * 0.3, width * 0.9);
    const minWidthPx = 420;
    const preferredWidthPx = viewportMetric * 0.52;
    const maxWidthPx = 1600;
    const finalWidthPx = Math.max(
      minWidthPx,
      Math.min(preferredWidthPx, maxWidthPx),
    );

    const scale =
      ((finalWidthPx / width) * visibleWidth) / logoBaseSize.current.x;

    tiltGroup.current.scale.setScalar(scale);

    const scaledWidth = logoBaseSize.current.x * scale;
    const scaledHeight = logoBaseSize.current.y * scale;

    const marginPx = Math.min(20, width * 0.03);
    const wideScreenLiftPx =
      aspectRatio >= 2.2 ? 120 : aspectRatio >= 1.9 ? 70 : 0;

    const marginWorldX = (marginPx / width) * visibleWidth;
    const marginWorldY = (marginPx / height) * visibleHeight;
    const wideScreenLiftWorld = (wideScreenLiftPx / height) * visibleHeight;

    const baseX = visibleWidth / 2 - scaledWidth / 2 - marginWorldX;
    const baseY =
      visibleHeight / 2 -
      scaledHeight / 2 -
      marginWorldY +
      wideScreenLiftWorld;

    basePosition.current.set(baseX, baseY, 0);

    anchorGroup.current.position.copy(basePosition.current);
    tiltGroup.current.rotation.set(Math.PI, 0, 0);
    currentRotation.current = { x: Math.PI, y: 0, z: 0 };
    pointer.current = { x: 0, y: 0 };

    renderer.current.render(scene.current, camera.current);
  }, [windowSize, prefersReducedMotion]);

  useEffect(() => {
    if (
      !anchorGroup.current ||
      !tiltGroup.current ||
      !renderer.current ||
      !scene.current ||
      !camera.current
    ) {
      return;
    }

    const rotationEase = 0.035;
    const maxRotX = 0.08;
    const maxRotY = 0.12;
    const maxRotZ = 0.04;

    const animate = () => {
      if (
        !anchorGroup.current ||
        !tiltGroup.current ||
        !renderer.current ||
        !scene.current ||
        !camera.current
      ) {
        return;
      }

      const px = pointer.current.x;
      const py = pointer.current.y;

      const targetRotX = Math.PI - py * maxRotX;
      const targetRotY = px * maxRotY;
      const targetRotZ =
        px * -maxRotZ +
        py * (maxRotZ * 0.2) +
        px * py * (maxRotZ * 0.25);

      currentRotation.current.x +=
        (targetRotX - currentRotation.current.x) * rotationEase;
      currentRotation.current.y +=
        (targetRotY - currentRotation.current.y) * rotationEase;
      currentRotation.current.z +=
        (targetRotZ - currentRotation.current.z) * rotationEase;

      anchorGroup.current.position.copy(basePosition.current);

      tiltGroup.current.rotation.x = currentRotation.current.x;
      tiltGroup.current.rotation.y = currentRotation.current.y;
      tiltGroup.current.rotation.z = currentRotation.current.z;

      renderer.current.render(scene.current, camera.current);
    };

    if (!prefersReducedMotion && isInViewport) {
      renderer.current.setAnimationLoop(animate);
    } else {
      pointer.current = { x: 0, y: 0 };
      currentRotation.current = { x: Math.PI, y: 0, z: 0 };
      anchorGroup.current.position.copy(basePosition.current);
      tiltGroup.current.rotation.set(Math.PI, 0, 0);

      renderer.current.setAnimationLoop(null);
      renderer.current.render(scene.current, camera.current);
    }

    return () => {
      if (renderer.current) renderer.current.setAnimationLoop(null);
    };
  }, [isInViewport, prefersReducedMotion, windowSize]);

  return (
    <Transition appear in onEnter={reflow} timeout={3000} nodeRef={nodeRef}>
      {(status) => (
        <div
          aria-hidden
          className={classNames(
            "displacement-sphere",
            `displacement-sphere--${status}`,
          )}
          ref={(node) => {
            container.current = node;
            nodeRef.current = node;
          }}
          {...props}
        />
      )}
    </Transition>
  );
};

export default Logo3D;
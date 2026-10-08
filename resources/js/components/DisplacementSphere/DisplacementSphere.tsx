import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import "./DisplacementSphere.css";

export type DisplacementSphereProps = {
    className?: string;
    size?: number;
};

export default function DisplacementSphere({ className = "", size = 560 }: DisplacementSphereProps) {
    const hostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host || typeof window === "undefined") return;

        let disposed = false;
        let frame = 0;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
        camera.position.set(0, 0, 4.6);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 1.1);
        const key = new THREE.DirectionalLight(0xffffff, 3.2);
        key.position.set(-3, 4, 6);
        const side = new THREE.DirectionalLight(0x8190ff, 3.5);
        side.position.set(4, 1, -4);
        const rim = new THREE.PointLight(0xffffff, 2.8, 12);
        rim.position.set(0, -2, -5);
        scene.add(ambient, key, side, rim);

        const logo = new THREE.Group();
        logo.rotation.set(-0.18, 0.28, Math.PI);
        scene.add(logo);

        const frontMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.18, roughness: 0.22 });
        const sideMaterial = new THREE.MeshStandardMaterial({ color: 0x6270cc, metalness: 0.45, roughness: 0.24 });
        const targetRotation = new THREE.Vector2(0.28, -0.18);
        const pointer = new THREE.Vector2();

        const resize = () => {
            const width = Math.max(host.clientWidth, 1);
            const height = Math.max(host.clientHeight, 1);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };

        const onPointerMove = (event: PointerEvent) => {
            const bounds = host.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
            targetRotation.y = 0.28 + pointer.x * 0.72;
            targetRotation.x = -0.18 - pointer.y * 0.42;
        };

        const onPointerLeave = () => {
            targetRotation.set(0.28, -0.18);
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        host.addEventListener("pointermove", onPointerMove);
        host.addEventListener("pointerleave", onPointerLeave);

        const loader = new SVGLoader();
        loader.load("/media/logo.svg", (data) => {
            if (disposed) return;

            const shapes = data.paths.flatMap((path) => SVGLoader.createShapes(path));
            const geometry = new THREE.ExtrudeGeometry(shapes, {
                depth: 1.15,
                bevelEnabled: true,
                bevelThickness: 0.11,
                bevelSize: 0.075,
                bevelSegments: 5,
                curveSegments: 12,
            });

            geometry.center();
            geometry.computeVertexNormals();

            const mesh = new THREE.Mesh(geometry, [frontMaterial, sideMaterial]);
            mesh.scale.setScalar(0.0082);
            logo.add(mesh);

            const animate = (time: number) => {
                if (disposed) return;

                const idleY = Math.sin(time * 0.00045) * 0.16;
                logo.rotation.y += (targetRotation.y + idleY - logo.rotation.y) * 0.045;
                logo.rotation.x += (targetRotation.x - logo.rotation.x) * 0.045;

                renderer.render(scene, camera);
                frame = window.requestAnimationFrame(animate);
            };

            frame = window.requestAnimationFrame(animate);
        });

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frame);
            observer.disconnect();
            host.removeEventListener("pointermove", onPointerMove);
            host.removeEventListener("pointerleave", onPointerLeave);
            logo.traverse((object) => {
                if (object instanceof THREE.Mesh) object.geometry.dispose();
            });
            frontMaterial.dispose();
            sideMaterial.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [size]);

    return <div ref={hostRef} className={`displacement-sphere ${className}`.trim()} style={{ width: size, height: size }} aria-hidden="true" />;
}

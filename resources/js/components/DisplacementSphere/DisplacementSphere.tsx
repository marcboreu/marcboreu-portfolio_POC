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
        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
        camera.position.set(0, 0, 4.2);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 1.4);
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
        keyLight.position.set(-2, 3, 5);
        scene.add(ambient, keyLight);

        const logo = new THREE.Group();
        scene.add(logo);

        const frontMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.05, roughness: 0.3 });
        const sideMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.08, roughness: 0.42 });

        const resize = () => {
            const width = Math.max(host.clientWidth, 1);
            const height = Math.max(host.clientHeight, 1);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(host);

        const loader = new SVGLoader();
        loader.load("/media/logo.svg", (data) => {
            if (disposed) return;
            const shapes = data.paths.flatMap((path) => SVGLoader.createShapes(path));
            const geometry = new THREE.ExtrudeGeometry(shapes, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 3, curveSegments: 8 });
            geometry.center();
            geometry.computeVertexNormals();
            const mesh = new THREE.Mesh(geometry, [frontMaterial, sideMaterial]);
            mesh.scale.setScalar(0.0082);
            mesh.rotation.z = Math.PI;
            logo.add(mesh);

            const animate = (time: number) => {
                if (disposed) return;
                logo.rotation.y = Math.sin(time * 0.00035) * 0.22;
                logo.rotation.x = -0.12 + Math.sin(time * 0.00025) * 0.035;
                renderer.render(scene, camera);
                frame = window.requestAnimationFrame(animate);
            };
            frame = window.requestAnimationFrame(animate);
        });

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frame);
            observer.disconnect();
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

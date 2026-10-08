import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./DisplacementSphere.css";
import { fragmentShader } from "./sphereFragShader";
import { vertexShader } from "./sphereVertShader";

export type DisplacementSphereProps = {
    className?: string;
    size?: number;
};

export default function DisplacementSphere({ className = "", size = 560 }: DisplacementSphereProps) {
    const hostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host || typeof window === "undefined") return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.z = 3.2;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(size, size, false);
        host.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(1, 96, 96);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColorA: { value: new THREE.Color("#7c3aed") },
                uColorB: { value: new THREE.Color("#22d3ee") },
            },
            transparent: true,
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

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

        let frame = 0;
        const animate = (time: number) => {
            material.uniforms.uTime.value = reducedMotion ? 0 : time * 0.00035;
            sphere.rotation.y = reducedMotion ? 0 : time * 0.00008;
            renderer.render(scene, camera);
            frame = window.requestAnimationFrame(animate);
        };
        frame = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(frame);
            observer.disconnect();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [size]);

    return <div ref={hostRef} className={`displacement-sphere ${className}`} style={{ width: size, height: size }} aria-hidden="true" />;
}

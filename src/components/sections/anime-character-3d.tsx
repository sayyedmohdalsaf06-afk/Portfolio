"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimeCharacter3DProps {
  onScrollDown?: () => void;
}

export function AnimeCharacter3D({ onScrollDown }: AnimeCharacter3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleClick = () => {
    if (onScrollDown) {
      onScrollDown();
    } else {
      const target = document.getElementById("whoami") || document.getElementById("project-experience");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene & Camera Setup
    const width = 200;
    const height = 200;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.08, 2.75);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lighting Rig (Cyan-Teal Cyber Accent + Soft Key Light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x22d3ee, 3.5);
    cyanRimLight.position.set(-3, 1, -1);
    scene.add(cyanRimLight);

    const tealFillLight = new THREE.PointLight(0x0d9488, 2.8, 10);
    tealFillLight.position.set(0, -1.5, 2);
    scene.add(tealFillLight);

    // 3. Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdfc4,
      roughness: 0.5,
      metalness: 0.05,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1f1917,
      roughness: 0.7,
      metalness: 0.1,
    });

    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.6,
      metalness: 0.15,
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.8,
    });

    const headsetMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.6,
    });

    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });

    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // 4. Character Hierarchy & Meshes
    const characterRoot = new THREE.Group();
    scene.add(characterRoot);

    // (A) Head & Face Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.35, 0);
    characterRoot.add(headGroup);

    // Head base (cute anime proportions)
    const headGeo = new THREE.SphereGeometry(0.48, 32, 32);
    headGeo.scale(1, 0.95, 0.9);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(headMesh);

    // Anime Eyes (Left & Right)
    const eyeGroup = new THREE.Group();
    headGroup.add(eyeGroup);

    [-0.17, 0.17].forEach((xPos, idx) => {
      // Eye White
      const eyeGeo = new THREE.SphereGeometry(0.11, 16, 16);
      eyeGeo.scale(0.85, 1.2, 0.4);
      const eye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      eye.position.set(xPos, 0.04, 0.38);
      eyeGroup.add(eye);

      // Pupil
      const pupilGeo = new THREE.SphereGeometry(0.08, 16, 16);
      pupilGeo.scale(0.8, 1.1, 0.4);
      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(xPos * 0.95, 0.03, 0.42);
      eyeGroup.add(pupil);

      // Cyan Iris Sparkle
      const irisRingGeo = new THREE.TorusGeometry(0.05, 0.012, 8, 16);
      const irisRing = new THREE.Mesh(irisRingGeo, cyanGlowMat);
      irisRing.position.set(xPos * 0.95, 0.03, 0.44);
      eyeGroup.add(irisRing);

      // Eye Catchlight Specular Dot
      const catchlightGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const catchlight = new THREE.Mesh(catchlightGeo, eyeHighlightMat);
      catchlight.position.set(xPos + (idx === 0 ? 0.02 : -0.02), 0.07, 0.45);
      eyeGroup.add(catchlight);
    });

    // Cute blush cheeks
    [-0.26, 0.26].forEach((xPos) => {
      const blushGeo = new THREE.SphereGeometry(0.06, 12, 12);
      blushGeo.scale(1.2, 0.5, 0.2);
      const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, opacity: 0.55, transparent: true });
      const blush = new THREE.Mesh(blushGeo, blushMat);
      blush.position.set(xPos, -0.09, 0.38);
      headGroup.add(blush);
    });

    // Stylized Anime Hair (Spikes & Bangs)
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Hair base dome
    const hairDomeGeo = new THREE.SphereGeometry(0.51, 24, 24);
    hairDomeGeo.scale(1.02, 1.05, 1.0);
    const hairDome = new THREE.Mesh(hairDomeGeo, hairMat);
    hairDome.position.set(0, 0.08, -0.04);
    hairGroup.add(hairDome);

    // Bangs & Spikes
    interface SpikeConfig {
      pos: [number, number, number];
      rot: [number, number, number];
      scale: [number, number, number];
    }

    const spikeConfigs: SpikeConfig[] = [
      { pos: [0, 0.48, 0.28], rot: [-0.2, 0, 0.1], scale: [0.18, 0.35, 0.16] },
      { pos: [-0.22, 0.42, 0.25], rot: [-0.1, 0.3, 0.5], scale: [0.16, 0.32, 0.14] },
      { pos: [0.22, 0.42, 0.25], rot: [-0.1, -0.3, -0.5], scale: [0.16, 0.32, 0.14] },
      { pos: [-0.38, 0.22, 0.18], rot: [0.1, 0.4, 0.8], scale: [0.15, 0.28, 0.14] },
      { pos: [0.38, 0.22, 0.18], rot: [0.1, -0.4, -0.8], scale: [0.15, 0.28, 0.14] },
      { pos: [-0.12, 0.28, 0.40], rot: [-0.5, 0.2, 0.2], scale: [0.12, 0.22, 0.12] },
      { pos: [0.14, 0.26, 0.40], rot: [-0.5, -0.2, -0.2], scale: [0.12, 0.22, 0.12] },
    ];

    spikeConfigs.forEach((cfg) => {
      const coneGeo = new THREE.ConeGeometry(cfg.scale[0], cfg.scale[1], 12);
      const spike = new THREE.Mesh(coneGeo, hairMat);
      spike.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      spike.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      hairGroup.add(spike);
    });

    // Futuristic Cyan Headset
    const headsetGroup = new THREE.Group();
    headGroup.add(headsetGroup);

    // Headband
    const bandGeo = new THREE.TorusGeometry(0.50, 0.04, 12, 32, Math.PI);
    const band = new THREE.Mesh(bandGeo, headsetMat);
    band.rotation.x = Math.PI / 2;
    band.position.set(0, 0.05, 0);
    headsetGroup.add(band);

    // Glowing headband strip
    const bandStripGeo = new THREE.TorusGeometry(0.51, 0.015, 8, 32, Math.PI);
    const bandStrip = new THREE.Mesh(bandStripGeo, cyanGlowMat);
    bandStrip.rotation.x = Math.PI / 2;
    bandStrip.position.set(0, 0.05, 0);
    headsetGroup.add(bandStrip);

    // Earcups with glowing cyan neon visualizer rings
    [-0.52, 0.52].forEach((xPos, idx) => {
      const cupGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.09, 24);
      cupGeo.rotateZ(Math.PI / 2);
      const cup = new THREE.Mesh(cupGeo, headsetMat);
      cup.position.set(xPos, 0.05, 0);
      headsetGroup.add(cup);

      const ringGeo = new THREE.TorusGeometry(0.12, 0.02, 12, 24);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, cyanGlowMat);
      ring.position.set(xPos + (idx === 0 ? -0.04 : 0.04), 0.05, 0);
      headsetGroup.add(ring);
    });

    // Headset Microphone
    const micArmGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8);
    micArmGeo.rotateZ(Math.PI / 3);
    const micArm = new THREE.Mesh(micArmGeo, headsetMat);
    micArm.position.set(0.42, -0.08, 0.24);
    headsetGroup.add(micArm);

    const micTipGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const micTip = new THREE.Mesh(micTipGeo, cyanGlowMat);
    micTip.position.set(0.26, -0.16, 0.36);
    headsetGroup.add(micTip);

    // (B) Body & Hoodie Group
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, -0.32, 0);
    characterRoot.add(bodyGroup);

    // Hoodie Torso
    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.36, 0.55, 24);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    bodyGroup.add(torso);

    // Hoodie Collar / Hood bunch
    const hoodCollarGeo = new THREE.TorusGeometry(0.29, 0.08, 12, 24);
    hoodCollarGeo.rotateX(Math.PI / 2);
    const hoodCollar = new THREE.Mesh(hoodCollarGeo, hoodieMat);
    hoodCollar.position.set(0, 0.26, 0);
    bodyGroup.add(hoodCollar);

    // Chest Cyan Tech Beacon
    const chestBeaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.015, 16);
    chestBeaconGeo.rotateX(Math.PI / 2);
    const chestBeacon = new THREE.Mesh(chestBeaconGeo, cyanGlowMat);
    chestBeacon.position.set(0, 0.12, 0.30);
    bodyGroup.add(chestBeacon);

    // (C) Animated Pointing Arm (Right Arm)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.36, 0.16, 0);
    bodyGroup.add(rightArmGroup);

    const rUpperArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.24, 16);
    const rUpperArm = new THREE.Mesh(rUpperArmGeo, hoodieMat);
    rUpperArm.position.set(0.06, -0.10, 0.05);
    rUpperArm.rotation.set(0.3, 0, -0.3);
    rightArmGroup.add(rUpperArm);

    // Forearm & Hand pointing down
    const rForearmGroup = new THREE.Group();
    rForearmGroup.position.set(0.12, -0.22, 0.10);
    rightArmGroup.add(rForearmGroup);

    const rForearmGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.20, 16);
    const rForearm = new THREE.Mesh(rForearmGeo, hoodieMat);
    rForearm.position.set(0, -0.08, 0);
    rForearmGroup.add(rForearm);

    // Hand mesh
    const handGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(0, -0.20, 0.02);
    rForearmGroup.add(hand);

    // Extended Pointing Finger (Pointing Downward!)
    const fingerGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.16, 12);
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(0, -0.29, 0.03);
    rForearmGroup.add(finger);

    // Glowing cyan finger ring/hologram tip
    const fingerTipGeo = new THREE.SphereGeometry(0.026, 12, 12);
    const fingerTip = new THREE.Mesh(fingerTipGeo, cyanGlowMat);
    fingerTip.position.set(0, -0.37, 0.03);
    rForearmGroup.add(fingerTip);

    // (D) Left Arm (Resting/Cheering)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.36, 0.16, 0);
    bodyGroup.add(leftArmGroup);

    const lUpperArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.24, 16);
    const lUpperArm = new THREE.Mesh(lUpperArmGeo, hoodieMat);
    lUpperArm.position.set(-0.06, -0.10, 0.02);
    lUpperArm.rotation.set(0.1, 0, 0.25);
    leftArmGroup.add(lUpperArm);

    const lHandGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const lHand = new THREE.Mesh(lHandGeo, skinMat);
    lHand.position.set(-0.12, -0.24, 0.08);
    leftArmGroup.add(lHand);

    // (E) Orbiting Holographic Reticle Ring
    const holoRingGeo = new THREE.TorusGeometry(0.78, 0.015, 8, 36);
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.45,
    });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.rotation.x = Math.PI / 2.3;
    holoRing.position.set(0, -0.05, 0);
    characterRoot.add(holoRing);

    // 5. Interactive Animation Loop & Pointer Tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let curRotY = 0;
    let curRotX = 0;
    let jumpY = 0;
    let jumpVel = 0;
    let blinkTimer = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotY = THREE.MathUtils.clamp(dx * 0.75, -0.65, 0.65);
      targetRotX = THREE.MathUtils.clamp(dy * 0.45, -0.40, 0.40);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // (a) Buoyant zero-G hover levitation
      const hoverFloatY = Math.sin(elapsedTime * 2.4) * 0.07;
      characterRoot.position.y = hoverFloatY + jumpY;

      // (b) Head & Eye Tracking with smooth easing
      curRotY += (targetRotY - curRotY) * 0.08;
      curRotX += (targetRotX - curRotX) * 0.08;

      headGroup.rotation.y = curRotY;
      headGroup.rotation.x = curRotX + 0.04;
      headGroup.rotation.z = Math.sin(elapsedTime * 1.8) * 0.03;

      // (c) Rhythmic pointing gesture animation (Right Hand points down excitedly!)
      const pointingCycle = Math.sin(elapsedTime * 4.5);
      rightArmGroup.rotation.x = 0.35 + pointingCycle * 0.18;
      rForearmGroup.rotation.x = -0.25 + pointingCycle * 0.12;

      // (d) Left arm subtle breathing swing
      leftArmGroup.rotation.z = Math.sin(elapsedTime * 2.0) * 0.06;

      // (e) Orbiting Holographic Ring Rotation
      holoRing.rotation.z = elapsedTime * 0.8;

      // (f) Blinking cycle
      blinkTimer += 0.016;
      if (blinkTimer > 3.2) {
        eyeGroup.scale.y = 0.1;
        if (blinkTimer > 3.35) {
          eyeGroup.scale.y = 1.0;
          blinkTimer = 0;
        }
      }

      // (g) Jump physics on click/hover
      if (jumpY > 0 || jumpVel !== 0) {
        jumpY += jumpVel;
        jumpVel -= 0.018;
        if (jumpY <= 0) {
          jumpY = 0;
          jumpVel = 0;
        }
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      scene.clear();
    };
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      data-cursor="clickable"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label="Interactive 3D animated character guide. Click to scroll down to workstation and projects"
      className="group relative inline-flex flex-col sm:flex-row items-center gap-3 select-none cursor-pointer py-1 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-xs"
    >
      {/* Speech Bubble / Dialogue Balloon */}
      <div
        className={`relative order-2 sm:order-1 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
          hovered
            ? "border-[var(--accent)] bg-[var(--surface-raised)] shadow-[0_0_16px_var(--accent-glow)] scale-[1.03]"
            : "border-[var(--hairline-strong)] bg-[var(--surface-raised)]/90 shadow-md"
        } backdrop-blur-md text-left`}
      >
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_6px_var(--accent)]" aria-hidden="true" />
          <span className="font-semibold tracking-tight text-[var(--accent)]">
            Scroll down for workstation &amp; projects!
          </span>
          <span
            className={`inline-block font-bold text-[var(--accent)] transition-transform duration-200 ${
              hovered ? "translate-y-1 scale-125" : "animate-anime-pointer"
            }`}
            aria-hidden="true"
          >
            ↓
          </span>
        </div>

        {/* Comic Speech Tail / Arrow pointer towards mascot */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-[var(--surface-raised)]"
        />
      </div>

      {/* Real-time WebGL 3D Animated Character Canvas */}
      <div className="relative order-1 sm:order-2 shrink-0 h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center">
        {/* Luminous Cyan/Teal Halo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-35 blur-md pointer-events-none animate-anime-pulse"
        />

        {/* 3D WebGL Canvas */}
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="relative w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110"
        />

        {/* Small Pointing Hand Indicator Badge */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-[var(--accent)] text-[#0a0f14] flex items-center justify-center text-[10px] font-extrabold shadow-sm border border-[var(--surface)] animate-anime-pointer"
        >
          ↓
        </span>
      </div>
    </div>
  );
}

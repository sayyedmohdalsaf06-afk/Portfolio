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
    const width = 160;
    const height = 160;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.04, 2.7);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Realistic Studio & Cyber Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x22d3ee, 3.8);
    cyanRimLight.position.set(-3, 1.2, -1);
    scene.add(cyanRimLight);

    const warmFillLight = new THREE.PointLight(0xd97706, 1.8, 8);
    warmFillLight.position.set(2, -1, 2);
    scene.add(warmFillLight);

    // 3. Materials — Modeled after Mohd Alsaf's portrait
    // Warm natural medium-olive skin tone
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xc88f60,
      roughness: 0.55,
      metalness: 0.04,
    });

    // Dark espresso hair
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x141212,
      roughness: 0.75,
      metalness: 0.08,
    });

    // Trimmed beard & mustache material
    const beardMat = new THREE.MeshStandardMaterial({
      color: 0x181413,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Jet black hoodie
    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x0f1115,
      roughness: 0.65,
      metalness: 0.12,
    });

    // Glowing cyan cyber accent
    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.8,
    });

    const headsetChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.7,
    });

    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfcfcfc,
      roughness: 0.1,
    });

    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x100c0a,
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
    headGroup.position.set(0, 0.32, 0);
    characterRoot.add(headGroup);

    // Head base (natural anime chibi proportions)
    const headGeo = new THREE.SphereGeometry(0.46, 32, 32);
    headGeo.scale(0.98, 1.0, 0.92);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(headMesh);

    // Anime Eyes (Left & Right)
    const eyeGroup = new THREE.Group();
    headGroup.add(eyeGroup);

    [-0.16, 0.16].forEach((xPos, idx) => {
      // Eye White
      const eyeGeo = new THREE.SphereGeometry(0.095, 16, 16);
      eyeGeo.scale(0.90, 1.15, 0.38);
      const eye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      eye.position.set(xPos, 0.05, 0.38);
      eyeGroup.add(eye);

      // Pupil (Dark espresso)
      const pupilGeo = new THREE.SphereGeometry(0.075, 16, 16);
      pupilGeo.scale(0.85, 1.05, 0.38);
      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(xPos * 0.96, 0.04, 0.42);
      eyeGroup.add(pupil);

      // Cyan Iris Sparkle Ring
      const irisRingGeo = new THREE.TorusGeometry(0.048, 0.010, 8, 16);
      const irisRing = new THREE.Mesh(irisRingGeo, cyanGlowMat);
      irisRing.position.set(xPos * 0.96, 0.04, 0.44);
      eyeGroup.add(irisRing);

      // Specular Catchlight
      const catchlightGeo = new THREE.SphereGeometry(0.022, 8, 8);
      const catchlight = new THREE.Mesh(catchlightGeo, eyeHighlightMat);
      catchlight.position.set(xPos + (idx === 0 ? 0.02 : -0.02), 0.075, 0.45);
      eyeGroup.add(catchlight);

      // Dark Defined Eyebrows (matching photo)
      const browGeo = new THREE.CylinderGeometry(0.018, 0.012, 0.16, 8);
      browGeo.rotateZ(Math.PI / 2 + (idx === 0 ? 0.12 : -0.12));
      const brow = new THREE.Mesh(browGeo, beardMat);
      brow.position.set(xPos, 0.18, 0.40);
      headGroup.add(brow);
    });

    // (B) Facial Hair (Neat trimmed beard, mustache, and goatee matching Alsaf's portrait)
    // 1. Mustache
    const stacheLeftGeo = new THREE.CylinderGeometry(0.016, 0.010, 0.13, 8);
    stacheLeftGeo.rotateZ(Math.PI / 2.3);
    const stacheLeft = new THREE.Mesh(stacheLeftGeo, beardMat);
    stacheLeft.position.set(-0.065, -0.08, 0.42);
    headGroup.add(stacheLeft);

    const stacheRightGeo = new THREE.CylinderGeometry(0.010, 0.016, 0.13, 8);
    stacheRightGeo.rotateZ(-Math.PI / 2.3);
    const stacheRight = new THREE.Mesh(stacheRightGeo, beardMat);
    stacheRight.position.set(0.065, -0.08, 0.42);
    headGroup.add(stacheRight);

    // 2. Chin Goatee & Soul Patch
    const goateeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    goateeGeo.scale(1.2, 0.9, 0.4);
    const goatee = new THREE.Mesh(goateeGeo, beardMat);
    goatee.position.set(0, -0.22, 0.38);
    headGroup.add(goatee);

    // 3. Jawline Stubble Outline
    [-0.20, 0.20].forEach((xPos, idx) => {
      const jawBeardGeo = new THREE.CylinderGeometry(0.018, 0.012, 0.20, 8);
      jawBeardGeo.rotateZ(idx === 0 ? -0.55 : 0.55);
      const jawBeard = new THREE.Mesh(jawBeardGeo, beardMat);
      jawBeard.position.set(xPos, -0.18, 0.32);
      headGroup.add(jawBeard);
    });

    // (C) Stylized Modern Haircut (Textured top crop + subtle fringe swept over forehead)
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Base Hair Shell
    const hairBaseGeo = new THREE.SphereGeometry(0.49, 24, 24);
    hairBaseGeo.scale(1.01, 1.04, 0.98);
    const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
    hairBase.position.set(0, 0.07, -0.03);
    hairGroup.add(hairBase);

    // Textured Hair Strands & Fringe (matching Alsaf's hair volume)
    interface HairStrandConfig {
      pos: [number, number, number];
      rot: [number, number, number];
      scale: [number, number, number];
    }

    const hairStrands: HairStrandConfig[] = [
      // Top Volume
      { pos: [0, 0.46, 0.16], rot: [-0.15, 0, 0.05], scale: [0.18, 0.26, 0.16] },
      { pos: [-0.16, 0.44, 0.14], rot: [-0.10, 0.2, 0.3], scale: [0.16, 0.24, 0.14] },
      { pos: [0.16, 0.44, 0.14], rot: [-0.10, -0.2, -0.3], scale: [0.16, 0.24, 0.14] },
      // Front Fringe Locks swept across forehead
      { pos: [-0.10, 0.30, 0.38], rot: [-0.65, 0.25, 0.3], scale: [0.11, 0.20, 0.10] },
      { pos: [0.08, 0.32, 0.38], rot: [-0.60, -0.20, -0.25], scale: [0.12, 0.20, 0.11] },
      { pos: [0.24, 0.26, 0.34], rot: [-0.50, -0.35, -0.5], scale: [0.10, 0.18, 0.10] },
      // Side Taper details
      { pos: [-0.36, 0.18, 0.15], rot: [0.1, 0.3, 0.6], scale: [0.12, 0.22, 0.12] },
      { pos: [0.36, 0.18, 0.15], rot: [0.1, -0.3, -0.6], scale: [0.12, 0.22, 0.12] },
    ];

    hairStrands.forEach((cfg) => {
      const coneGeo = new THREE.ConeGeometry(cfg.scale[0], cfg.scale[1], 10);
      const strand = new THREE.Mesh(coneGeo, hairMat);
      strand.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      strand.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      hairGroup.add(strand);
    });

    // (D) Futuristic Cyber Earpiece & Headset
    const headsetGroup = new THREE.Group();
    headGroup.add(headsetGroup);

    // Slim headband
    const bandGeo = new THREE.TorusGeometry(0.48, 0.025, 10, 32, Math.PI);
    const band = new THREE.Mesh(bandGeo, headsetChassisMat);
    band.rotation.x = Math.PI / 2;
    band.position.set(0, 0.06, 0);
    headsetGroup.add(band);

    // Glowing cyan strip
    const bandStripGeo = new THREE.TorusGeometry(0.485, 0.012, 8, 32, Math.PI);
    const bandStrip = new THREE.Mesh(bandStripGeo, cyanGlowMat);
    bandStrip.rotation.x = Math.PI / 2;
    bandStrip.position.set(0, 0.06, 0);
    headsetGroup.add(bandStrip);

    // Earcups with glowing cyan rings
    [-0.49, 0.49].forEach((xPos, idx) => {
      const cupGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.07, 20);
      cupGeo.rotateZ(Math.PI / 2);
      const cup = new THREE.Mesh(cupGeo, headsetChassisMat);
      cup.position.set(xPos, 0.05, 0);
      headsetGroup.add(cup);

      const ringGeo = new THREE.TorusGeometry(0.10, 0.018, 10, 20);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, cyanGlowMat);
      ring.position.set(xPos + (idx === 0 ? -0.035 : 0.035), 0.05, 0);
      headsetGroup.add(ring);
    });

    // Headset Mic
    const micArmGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.24, 8);
    micArmGeo.rotateZ(Math.PI / 2.8);
    const micArm = new THREE.Mesh(micArmGeo, headsetChassisMat);
    micArm.position.set(0.38, -0.08, 0.22);
    headsetGroup.add(micArm);

    const micTipGeo = new THREE.SphereGeometry(0.028, 10, 10);
    const micTip = new THREE.Mesh(micTipGeo, cyanGlowMat);
    micTip.position.set(0.24, -0.15, 0.34);
    headsetGroup.add(micTip);

    // (E) Body & Black Hoodie
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, -0.30, 0);
    characterRoot.add(bodyGroup);

    // Hoodie Torso
    const torsoGeo = new THREE.CylinderGeometry(0.26, 0.34, 0.50, 20);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    bodyGroup.add(torso);

    // Hoodie Collar Rim
    const hoodCollarGeo = new THREE.TorusGeometry(0.27, 0.07, 10, 20);
    hoodCollarGeo.rotateX(Math.PI / 2);
    const hoodCollar = new THREE.Mesh(hoodCollarGeo, hoodieMat);
    hoodCollar.position.set(0, 0.24, 0);
    bodyGroup.add(hoodCollar);

    // Chest Cyan Micro Beacon
    const chestBeaconGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.012, 12);
    chestBeaconGeo.rotateX(Math.PI / 2);
    const chestBeacon = new THREE.Mesh(chestBeaconGeo, cyanGlowMat);
    chestBeacon.position.set(0, 0.10, 0.28);
    bodyGroup.add(chestBeacon);

    // (F) Pointing Arm (Right Arm)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.33, 0.14, 0);
    bodyGroup.add(rightArmGroup);

    const rUpperArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.22, 14);
    const rUpperArm = new THREE.Mesh(rUpperArmGeo, hoodieMat);
    rUpperArm.position.set(0.05, -0.09, 0.04);
    rUpperArm.rotation.set(0.25, 0, -0.25);
    rightArmGroup.add(rUpperArm);

    // Forearm & Pointing Hand
    const rForearmGroup = new THREE.Group();
    rForearmGroup.position.set(0.10, -0.19, 0.08);
    rightArmGroup.add(rForearmGroup);

    const rForearmGeo = new THREE.CylinderGeometry(0.068, 0.062, 0.18, 14);
    const rForearm = new THREE.Mesh(rForearmGeo, hoodieMat);
    rForearm.position.set(0, -0.07, 0);
    rForearmGroup.add(rForearm);

    // Hand mesh
    const handGeo = new THREE.SphereGeometry(0.062, 14, 14);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(0, -0.17, 0.02);
    rForearmGroup.add(hand);

    // Extended Pointing Finger (Pointing Downwards ↓)
    const fingerGeo = new THREE.CylinderGeometry(0.022, 0.018, 0.14, 10);
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(0, -0.25, 0.025);
    rForearmGroup.add(finger);

    // Glowing cyan finger ring / precision cursor tip
    const fingerTipGeo = new THREE.SphereGeometry(0.024, 10, 10);
    const fingerTip = new THREE.Mesh(fingerTipGeo, cyanGlowMat);
    fingerTip.position.set(0, -0.32, 0.025);
    rForearmGroup.add(fingerTip);

    // (G) Left Arm (Casual Rest)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.33, 0.14, 0);
    bodyGroup.add(leftArmGroup);

    const lUpperArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.22, 14);
    const lUpperArm = new THREE.Mesh(lUpperArmGeo, hoodieMat);
    lUpperArm.position.set(-0.05, -0.09, 0.02);
    lUpperArm.rotation.set(0.1, 0, 0.20);
    leftArmGroup.add(lUpperArm);

    const lHandGeo = new THREE.SphereGeometry(0.062, 14, 14);
    const lHand = new THREE.Mesh(lHandGeo, skinMat);
    lHand.position.set(-0.10, -0.21, 0.06);
    leftArmGroup.add(lHand);

    // (H) Orbiting Holographic Cyber Ring
    const holoRingGeo = new THREE.TorusGeometry(0.72, 0.012, 8, 32);
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.40,
    });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.rotation.x = Math.PI / 2.3;
    holoRing.position.set(0, -0.06, 0);
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

      targetRotY = THREE.MathUtils.clamp(dx * 0.70, -0.60, 0.60);
      targetRotX = THREE.MathUtils.clamp(dy * 0.40, -0.35, 0.35);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // (a) Buoyant zero-G hover levitation
      const hoverFloatY = Math.sin(elapsedTime * 2.4) * 0.05;
      characterRoot.position.y = hoverFloatY + jumpY;

      // (b) Head & Eye Tracking with smooth easing
      curRotY += (targetRotY - curRotY) * 0.08;
      curRotX += (targetRotX - curRotX) * 0.08;

      headGroup.rotation.y = curRotY;
      headGroup.rotation.x = curRotX + 0.03;
      headGroup.rotation.z = Math.sin(elapsedTime * 1.8) * 0.02;

      // (c) Rhythmic pointing gesture animation (Right Hand points down excitedly!)
      const pointingCycle = Math.sin(elapsedTime * 4.5);
      rightArmGroup.rotation.x = 0.30 + pointingCycle * 0.16;
      rForearmGroup.rotation.x = -0.22 + pointingCycle * 0.10;

      // (d) Left arm subtle breathing swing
      leftArmGroup.rotation.z = Math.sin(elapsedTime * 2.0) * 0.05;

      // (e) Orbiting Holographic Ring Rotation
      holoRing.rotation.z = elapsedTime * 0.75;

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
        jumpVel -= 0.016;
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
      className="group relative inline-flex items-center gap-2.5 select-none cursor-pointer py-0.5 transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-xs"
    >
      {/* Speech Bubble / Dialogue Balloon */}
      <div
        className={`relative px-3 py-1 rounded-full border transition-all duration-300 ${
          hovered
            ? "border-[var(--accent)] bg-[var(--surface-raised)] shadow-[0_0_12px_var(--accent-glow)] scale-[1.02]"
            : "border-[var(--hairline-strong)] bg-[var(--surface-raised)]/90 shadow-xs"
        } backdrop-blur-md text-left`}
      >
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_6px_var(--accent)]" aria-hidden="true" />
          <span className="font-medium tracking-tight text-[var(--accent)]">
            Scroll down for workstation &amp; projects!
          </span>
          <span
            className={`inline-block font-bold text-[var(--accent)] transition-transform duration-200 ${
              hovered ? "translate-y-0.5 scale-110" : "animate-anime-pointer"
            }`}
            aria-hidden="true"
          >
            ↓
          </span>
        </div>

        {/* Comic Speech Tail / Arrow pointer towards mascot */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-[var(--surface-raised)]"
        />
      </div>

      {/* Real-time WebGL 3D Animated Character Canvas */}
      <div className="relative shrink-0 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center">
        {/* Luminous Cyan/Teal Halo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-30 blur-sm pointer-events-none animate-anime-pulse"
        />

        {/* 3D WebGL Canvas */}
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="relative w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-105"
        />

        {/* Small Pointing Hand Indicator Badge */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-[var(--accent)] text-[#0a0f14] flex items-center justify-center text-[9px] font-extrabold shadow-xs border border-[var(--surface)] animate-anime-pointer"
        >
          ↓
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

interface ShoeViewerProps {
  selectedVariant: string;
}

export function ShoeViewer({ selectedVariant }: ShoeViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const variantsRef = useRef<any>(null);
  const currentVariantRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to select material variant
  const selectVariant = (variantIndex: number) => {
    if (!modelRef.current || !variantsRef.current) return;

    const variants = variantsRef.current.variants;
    if (!variants || variantIndex >= variants.length) return;

    // const variant = variants[variantIndex];
    // console.log("variant", variant);
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mesh = child;
        const userData = mesh.userData;

        if (
          userData.gltfExtensions &&
          userData.gltfExtensions.KHR_materials_variants
        ) {
          const meshVariants =
            userData.gltfExtensions.KHR_materials_variants.mappings;

          for (const mapping of meshVariants) {
            if (mapping.variants.includes(variantIndex)) {
              // Switch to the variant material
              if (mapping.material !== undefined) {
                const materials = variantsRef.current.materials;
                if (materials && materials[mapping.material]) {
                  mesh.material = materials[mapping.material];
                }
              }
              break;
            }
          }
        }
      }
    });

    currentVariantRef.current = variantIndex;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Enhanced lighting setup (replacing HDR environment)
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemisphereLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(-5, 5, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Load shoe model
    const loader = new GLTFLoader();

    // Try to load the actual model, fallback to created shoe
    loader.load(
      "MaterialsVariantsShoe.gltf",
      async (gltf) => {
        const model = gltf.scene;
        console.log("model", model);

        modelRef.current = model;

        // Get all variant names
        let variants = [];
        if (
          gltf.parser &&
          gltf.parser.json.extensions &&
          gltf.parser.json.extensions.KHR_materials_variants
        ) {
          variants =
            gltf.parser.json.extensions.KHR_materials_variants.variants;
        }

        // Get all materials using parser.getDependency
        let allMaterials = [];
        if (gltf.parser && gltf.parser.json.materials) {
          const materialPromises = [];
          for (let i = 0; i < gltf.parser.json.materials.length; i++) {
            materialPromises.push(gltf.parser.getDependency("material", i));
          }
          allMaterials = await Promise.all(materialPromises);
        }

        variantsRef.current = {
          variants,
          materials: allMaterials,
        };

        // Store original materials
        // const materials: THREE.Material[] = [];
        // gltf.scene.traverse((child) => {
        //   if (child instanceof THREE.Mesh && child.material) {
        //     if (Array.isArray(child.material)) {
        //       materials.push(...child.material);
        //     } else {
        //       materials.push(child.material);
        //     }
        //   }
        // });

        // variantsRef.current.materials = materials;

        // Scale and position the model
        model.scale.set(10, 10, 10);
        model.position.y = -0.5;

        // Enable shadows
        // model.traverse((child) => {
        //   if (child instanceof THREE.Mesh) {
        //     child.castShadow = true;
        //     child.receiveShadow = true;
        //   }
        // });

        scene.add(model);
        setIsLoading(false);

        // Setup animation mixer if animations exist
        // if (gltf.animations && gltf.animations.length > 0) {
        //   mixerRef.current = new THREE.AnimationMixer(model);
        //   gltf.animations.forEach((clip) => {
        //     mixerRef.current?.clipAction(clip).play();
        //   });
        // }
      },
      (progress) => {
        console.log("Loading progress:", progress);
      },
      (error) => {
        console.warn("Failed to load shoe model, using fallback:", error);
        // const fallbackShoe = createFallbackShoe();
        // modelRef.current = fallbackShoe;
        // scene.add(fallbackShoe);
        setIsLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      controls.update();

      if (mixerRef.current) {
        mixerRef.current.update(0.016);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Handle variant changes
  useEffect(() => {
    const variantMap: { [key: string]: number } = {
      midnight: 0,
      beach: 1,
      street: 2,
    };

    const variantIndex = variantMap[selectedVariant] || 0;
    selectVariant(variantIndex);
  }, [selectedVariant]);

  // useEffect(() => {
  //   if (!modelRef.current || !variantsRef.current) return;

  //   const variantMap: { [key: string]: number } = {
  //     midnight: 0,
  //     beach: 1,
  //     street: 2,
  //   };

  //   const variantIndex = variantMap[selectedVariant] ?? 0;

  //   // Call your selectVariant function or inline this logic here.
  //   modelRef.current.traverse((child) => {
  //     if (child instanceof THREE.Mesh && child.material) {
  //       const userData = child.userData;

  //       if (
  //         userData.gltfExtensions &&
  //         userData.gltfExtensions.KHR_materials_variants
  //       ) {
  //         const meshVariants =
  //           userData.gltfExtensions.KHR_materials_variants.mappings;
  //         console.log("meshVariants", meshVariants);
  //         for (const mapping of meshVariants) {
  //           if (mapping.variants.includes(variantIndex)) {
  //             if (mapping.material !== undefined) {
  //               const materials = variantsRef.current.materials;

  //               if (materials && materials[mapping.material]) {
  //                 child.material = materials[mapping.material];
  //                 child.material.needsUpdate = true;
  //               }
  //             }
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   });

  //   currentVariantRef.current = variantIndex;
  // }, [selectedVariant]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 3D model...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
        Click and drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

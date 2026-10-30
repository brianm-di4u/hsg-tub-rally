// Entry for the vendored three.js bundle (see tools/build-vendor.mjs). Named exports only, so esbuild
// can drop what the game never touches. Add a name here before using it in src/js/gfx/.
export {
  WebGLRenderer, WebGLRenderTarget, Scene, PerspectiveCamera, OrthographicCamera, Group, Object3D,
  Mesh, InstancedMesh, SkinnedMesh, Bone, Skeleton, Points, LineSegments, Line, Sprite,
  BufferGeometry, BufferAttribute, InstancedBufferGeometry, InstancedBufferAttribute, InterleavedBufferAttribute,
  Float32BufferAttribute, Uint8BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute,
  PlaneGeometry, BoxGeometry, CylinderGeometry, SphereGeometry, ConeGeometry, CircleGeometry, RingGeometry,
  MeshBasicMaterial, MeshLambertMaterial, ShaderMaterial, PointsMaterial, LineBasicMaterial, SpriteMaterial,
  Texture, DataTexture, CanvasTexture,
  Color, Vector2, Vector3, Vector4, Quaternion, Euler, Matrix3, Matrix4, Box3, Sphere, Frustum, Plane, Ray,
  Raycaster, MathUtils, Fog, AnimationMixer, AnimationClip, LoopOnce, LoopRepeat,
  UniformsLib, UniformsUtils, ShaderChunk, ColorManagement,
  LinearFilter, NearestFilter, LinearMipmapLinearFilter, NearestMipmapNearestFilter,
  RepeatWrapping, ClampToEdgeWrapping, MirroredRepeatWrapping,
  SRGBColorSpace, NoColorSpace, LinearSRGBColorSpace,
  DoubleSide, FrontSide, BackSide, NoToneMapping, RGBAFormat, RedFormat, UnsignedByteType, FloatType, HalfFloatType,
  AdditiveBlending, NormalBlending, DynamicDrawUsage, StaticDrawUsage,
} from 'three';
export { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
export { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

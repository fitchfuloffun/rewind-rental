// In your StoreScene component
import { useThree } from "@react-three/fiber";
import { CubeTextureLoader } from "three";
import { getAssetUrl } from "@/utils/asset.ts";

export function SkyBox() {
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    getAssetUrl("/assets/textures/skybox/px.png"),
    getAssetUrl("/assets/textures/skybox/nx.png"),
    getAssetUrl("/assets/textures/skybox/py.png"),
    getAssetUrl("/assets/textures/skybox/ny.png"),
    getAssetUrl("/assets/textures/skybox/pz.png"),
    getAssetUrl("/assets/textures/skybox/nz.png"),
  ]);

  useThree(({ scene }) => {
    scene.background = texture;
  });

  return null;
}

function getPhotoTransform(profile: BuilderProfile) {
  const adjustment = profile.adjustment ?? {
    x: 0,
    y: 0,
    scale: 1,
  };

  const sourceWidth = 928;
  const sourceHeight = 560;

  const imageRatio =
    getImageDimensions(profile);

  let baseWidth = sourceWidth;
  let baseHeight = sourceHeight;

  if (imageRatio > sourceWidth / sourceHeight) {
    baseHeight = sourceHeight;
    baseWidth = sourceHeight * imageRatio;
  } else {
    baseWidth = sourceWidth;
    baseHeight = sourceWidth / imageRatio;
  }

  const width =
    baseWidth * adjustment.scale;

  const height =
    baseHeight * adjustment.scale;

  const extraX = Math.max(
    0,
    width - sourceWidth
  );

  const extraY = Math.max(
    0,
    height - sourceHeight
  );

  const left =
    -extraX / 2 +
    (extraX / 2) *
      (adjustment.x / 100);

  const top =
    -extraY / 2 +
    (extraY / 2) *
      (adjustment.y / 100);

  return {
    width,
    height,
    left,
    top,
  };
}

function getImageDimensions(
  profile: BuilderProfile
) {
  if (
    profile.imageWidth &&
    profile.imageHeight &&
    profile.imageWidth > 0 &&
    profile.imageHeight > 0
  ) {
    return (
      profile.imageWidth /
      profile.imageHeight
    );
  }

  return 4 / 3;
}

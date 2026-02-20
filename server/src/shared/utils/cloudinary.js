const cloudinary = require('cloudinary').v2;

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadAvatar(buffer, options = {}) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are missing');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'moviemon/avatars',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    stream.end(buffer);
  });
}

async function deleteAvatar(publicId) {
  if (!publicId) {
    return null;
  }
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are missing');
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });
}

async function deleteAvatarsByPrefix(prefixes = []) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are missing');
  }
  const list = Array.isArray(prefixes) ? prefixes : [prefixes];
  const unique = list.filter(Boolean);
  if (unique.length === 0) {
    return [];
  }
  const results = [];
  for (const prefix of unique) {
    const result = await cloudinary.api.delete_resources_by_prefix(prefix, {
      resource_type: 'image',
      type: 'upload',
      invalidate: true,
    });
    results.push(result);
  }
  return results;
}

async function listResourcesByPrefix(prefix) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are missing');
  }
  const resources = [];
  let nextCursor;
  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix,
      max_results: 100,
      next_cursor: nextCursor,
    });
    if (Array.isArray(result.resources)) {
      resources.push(...result.resources);
    }
    nextCursor = result.next_cursor;
  } while (nextCursor);
  return resources;
}

async function deleteResources(publicIds = []) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are missing');
  }
  const ids = Array.isArray(publicIds) ? publicIds.filter(Boolean) : [];
  if (ids.length === 0) {
    return null;
  }
  return cloudinary.api.delete_resources(ids, {
    resource_type: 'image',
    type: 'upload',
    invalidate: true,
  });
}

async function cleanupAvatarsByPrefix(prefix, keepPublicId) {
  if (!prefix) {
    return [];
  }
  const resources = await listResourcesByPrefix(prefix);
  const toDelete = resources
    .map((resource) => resource.public_id)
    .filter((publicId) => publicId && publicId !== keepPublicId);
  if (toDelete.length === 0) {
    return [];
  }
  await deleteResources(toDelete);
  return toDelete;
}

module.exports = {
  uploadAvatar,
  deleteAvatar,
  deleteAvatarsByPrefix,
  cleanupAvatarsByPrefix,
};

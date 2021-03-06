/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { useStartServices } from '../../../hooks/use_core';
import { PLUGIN_ID } from '../../../constants';
import { epmRouteService } from '../../../services';
import { RegistryImage } from '../../../../../../common';

const removeRelativePath = (relativePath: string): string =>
  new URL(relativePath, 'http://example.com').pathname;

export function useLinks() {
  const { http } = useStartServices();
  return {
    toAssets: (path: string) => http.basePath.prepend(`/plugins/${PLUGIN_ID}/assets/${path}`),
    toPackageImage: (img: RegistryImage, pkgName: string, pkgVersion: string): string =>
      img.src
        ? http.basePath.prepend(
            epmRouteService.getFilePath(`/package/${pkgName}/${pkgVersion}${img.src}`)
          )
        : http.basePath.prepend(epmRouteService.getFilePath(img.path)),
    toRelativeImage: ({
      path,
      packageName,
      version,
    }: {
      path: string;
      packageName: string;
      version: string;
    }) => {
      const imagePath = removeRelativePath(path);
      const pkgkey = `${packageName}-${version}`;
      const filePath = `${epmRouteService.getInfoPath(pkgkey)}/${imagePath}`;
      return http.basePath.prepend(filePath);
    },
  };
}

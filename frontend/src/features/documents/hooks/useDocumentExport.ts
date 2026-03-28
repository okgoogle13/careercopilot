import { useCallback } from 'react';

import { exportDocumentAsDocx, type ExportableDocument } from '../services/docxExport';

export function useDocumentExport() {
  const exportDocx = useCallback(async (document: ExportableDocument) => {
    await exportDocumentAsDocx(document);
  }, []);

  return {
    exportDocx,
  };
}

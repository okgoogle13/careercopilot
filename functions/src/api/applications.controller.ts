import { Buffer } from "buffer";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { Request, Response } from "express";
import admin from "firebase-admin";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import functions from "firebase-functions";
import { validateFirebaseIdToken } from "../middleware/auth.middleware";
import { handleError, sendResponse } from "../utils/api.utils";
import PDFDocument = require("pdfkit");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const applicationsRef = db.collection("applications");

// Types
type ApplicationStatus =
  | "draft"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "accepted"
  | "archived";

interface Contact {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
}

interface InterviewSchedule {
  id: string;
  type: "phone" | "video" | "in-person" | "written";
  scheduledDate?: string;
  duration?: number;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  feedback?: string;
}

interface Application {
  id: string;
  userId: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  source: "email" | "manual" | "job_board";
  status: ApplicationStatus;
  appliedDate?: string;
  deadline?: string;
  contacts?: Contact[];
  interviews?: InterviewSchedule[];
  documents?: {
    resumeId?: string;
    coverLetterId?: string;
    kscId?: string;
  };
  resumeId?: string;
  coverLetterId?: string;
  kscId?: string;
  notes?: string;
  rating?: number;
  createdAt: admin.firestore.Timestamp | admin.firestore.FieldValue;
  updatedAt: admin.firestore.Timestamp | admin.firestore.FieldValue;
}

// Helper function to convert Firestore document to Application
const applicationFromFirestore = (doc: QueryDocumentSnapshot): Application => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    jobId: data.jobId,
    jobTitle: data.jobTitle,
    companyName: data.companyName,
    jobDescription: data.jobDescription,
    source: data.source || "manual",
    status: data.status || "draft",
    appliedDate: data.appliedDate,
    deadline: data.deadline,
    contacts: data.contacts || [],
    interviews: data.interviews || [],
    documents: data.documents || {},
    resumeId: data.resumeId || data.documents?.resumeId,
    coverLetterId: data.coverLetterId || data.documents?.coverLetterId,
    kscId: data.kscId || data.documents?.kscId,
    notes: data.notes,
    rating: data.rating,
    createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: data.updatedAt || admin.firestore.FieldValue.serverTimestamp(),
  };
};

/**
 * Create a new job application
 * POST /applications
 */
export const createApplication = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    // Authenticate user
    const { userId, error } = await validateFirebaseIdToken(req, res);
    if (!userId || error) {
      return sendResponse(res, 401, { error: error || "Unauthorized" });
    }

    const applicationData: Omit<Application, "id"> = {
      ...(req.body as Omit<Application, "id">),
      userId,
      status: "draft",
      source: "manual",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await applicationsRef.add(applicationData);
    const createdApp = {
      id: docRef.id,
      ...applicationData,
      jobTitle: applicationData.jobTitle || "",
      companyName: applicationData.companyName || "",
      jobDescription: applicationData.jobDescription || "",
    } as Application;

    return sendResponse(res, 201, createdApp);
  } catch (error) {
    return handleError(res, error, "Error creating application");
  }
});

/**
 * Get all applications for a user
 * GET /applications
 */
export const listApplications = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    const { userId, error } = await validateFirebaseIdToken(req, res);
    if (!userId || error) {
      return sendResponse(res, 401, { error: error || "Unauthorized" });
    }

    const { status, company } = req.query;
    let query = applicationsRef.where("userId", "==", userId);

    if (status) {
      query = query.where("status", "==", status);
    }

    if (company) {
      query = query
        .where("companyName", ">=", company)
        .where("companyName", "<=", company + "\uf8ff");
    }

    const snapshot = await query.orderBy("updatedAt", "desc").get();
    const applications = snapshot.docs.map((doc: QueryDocumentSnapshot) =>
      applicationFromFirestore(doc),
    );

    return sendResponse(res, 200, applications);
  } catch (error) {
    return handleError(res, error, "Error listing applications");
  }
});

/**
 * Get a single application by ID
 * GET /applications/:id
 */
export const getApplication = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    const { userId, error } = await validateFirebaseIdToken(req, res);
    if (!userId || error) {
      return sendResponse(res, 401, { error: error || "Unauthorized" });
    }

    const { id } = req.params;
    const doc = await applicationsRef.doc(id).get();

    if (!doc.exists) {
      return sendResponse(res, 404, { error: "Application not found" });
    }

    const application = applicationFromFirestore(doc as QueryDocumentSnapshot);

    if (application.userId !== userId) {
      return sendResponse(res, 403, { error: "Forbidden" });
    }

    return sendResponse(res, 200, application);
  } catch (error) {
    return handleError(res, error, "Error getting application");
  }
});

/**
 * Update an application
 * PATCH /applications/:id
 */
export const updateApplication = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    const { userId, error } = await validateFirebaseIdToken(req, res);
    if (!userId || error) {
      return sendResponse(res, 401, { error: error || "Unauthorized" });
    }

    const { id } = req.params;
    const updateData: Partial<Application> = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = applicationsRef.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return sendResponse(res, 404, { error: "Application not found" });
    }

    const application = doc.data() as Application;
    if (application.userId !== userId) {
      return sendResponse(res, 403, { error: "Forbidden" });
    }

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return sendResponse(res, 200, applicationFromFirestore(updatedDoc as QueryDocumentSnapshot));
  } catch (error) {
    return handleError(res, error, "Error updating application");
  }
});

/**
 * Delete an application
 * DELETE /applications/:id
 */
export const deleteApplication = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    const { userId, error } = await validateFirebaseIdToken(req, res);
    if (!userId || error) {
      return sendResponse(res, 401, { error: error || "Unauthorized" });
    }

    const { id } = req.params;
    const doc = await applicationsRef.doc(id).get();

    if (!doc.exists) {
      return sendResponse(res, 404, { error: "Application not found" });
    }

    const application = doc.data() as Application;
    if (application.userId !== userId) {
      return sendResponse(res, 403, { error: "Forbidden" });
    }

    await applicationsRef.doc(id).delete();
    return sendResponse(res, 204);
  } catch (error) {
    return handleError(res, error, "Error deleting application");
  }
});

/**
 * Schedule an interview for an application
 * POST /applications/:id/interviews
 */
export const scheduleInterview = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    const { userId, error } = await validateFirebaseIdToken(req, res);
    if (!userId || error) {
      return sendResponse(res, 401, { error: error || "Unauthorized" });
    }

    const { id } = req.params;
    const interviewData: InterviewSchedule = {
      id: admin.firestore().collection("_").doc().id, // Generate a unique ID
      ...req.body,
      status: "scheduled",
    };

    const docRef = applicationsRef.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return sendResponse(res, 404, { error: "Application not found" });
    }

    const application = doc.data() as Application;
    if (application.userId !== userId) {
      return sendResponse(res, 403, { error: "Forbidden" });
    }

    const interviews = [...(application.interviews || []), interviewData];

    await docRef.update({
      interviews,
      status: "interview",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return sendResponse(res, 201, applicationFromFirestore(updatedDoc as QueryDocumentSnapshot));
  } catch (error) {
    return handleError(res, error, "Error scheduling interview");
  }
});

/**
 * Bulk update applications
 * PATCH /applications/bulk-update
 */
export const bulkUpdateApplications = functions.https.onRequest(
  async (req: Request, res: Response) => {
    try {
      const { userId, error } = await validateFirebaseIdToken(req, res);
      if (!userId || error) {
        return sendResponse(res, 401, { error: error || "Unauthorized" });
      }

      const { ids, updates } = req.body as { ids: string[]; updates: Partial<Application> };

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return sendResponse(res, 400, { error: "No application IDs provided" });
      }

      const batch = db.batch();
      const timestamp = admin.firestore.FieldValue.serverTimestamp();

      for (const id of ids) {
        const docRef = applicationsRef.doc(id);
        batch.update(docRef, {
          ...updates,
          updatedAt: timestamp,
        });
      }

      await batch.commit();
      return sendResponse(res, 200, { success: true, updated: ids.length });
    } catch (error) {
      return handleError(res, error, "Error bulk updating applications");
    }
  },
);

/**
 * Export applications to various formats
 * GET /applications/export?format=csv&status=applied
 *
 * Supported formats: json, csv, pdf, doc
 */
export const exportApplications = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    const { userId, error } = await validateFirebaseIdToken(req, res);
    if (!userId || error) {
      return sendResponse(res, 401, { error: error || "Unauthorized" });
    }

    const { format = "json", status } = req.query;
    let query = applicationsRef.where("userId", "==", userId);

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    const applications = snapshot.docs.map((doc: QueryDocumentSnapshot) =>
      applicationFromFirestore(doc),
    );
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    let exportData: string | Buffer | null = null;
    let contentType: string;
    let filename: string;

    switch (format) {
      case "json": {
        exportData = JSON.stringify(applications, null, 2);
        contentType = "application/json";
        filename = `applications-${timestamp}.json`;
        break;
      }

      case "csv": {
        const headers = [
          "id",
          "companyName",
          "jobTitle",
          "status",
          "appliedDate",
          "location",
          "salary",
          "rating",
          "source",
          "updatedAt",
        ];

        const csvRows = [
          headers.join(","),
          ...applications.map((app: Application) =>
            headers
              .map((field: string, index: number) => {
                const value = (app as unknown as Record<string, unknown>)[field] ?? "";
                // CSV escaping: double double-quotes to escape quotes per RFC 4180
                return `"${value.toString().replace(/"/g, '""')}"`;
              })
              .join(","),
          ),
        ];

        exportData = csvRows.join("\n");
        contentType = "text/csv";
        filename = `applications-${timestamp}.csv`;
        break;
      }

      case "pdf": {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          // Handled by the Promise below
        });

        doc.fontSize(20).text("Job Applications", { align: "center" });
        doc.moveDown();

        applications.forEach((app: Application, index: number) => {
          doc
            .fontSize(14)
            .text(`${index + 1}. ${app.companyName} - ${app.jobTitle} (${app.status})`);
          doc.fontSize(10).text(`Applied: ${app.appliedDate || "N/A"}`);
          doc.moveDown();
        });

        doc.end();

        // Wait for PDF generation to complete
        await new Promise<void>((resolve) => {
          doc.on("end", () => {
            exportData = Buffer.concat(buffers);
            resolve();
          });
        });

        contentType = "application/pdf";
        filename = `applications-${timestamp}.pdf`;
        break;
      }

      case "doc": {
        const docx = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  text: "Job Applications",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { after: 200 },
                }),
                ...applications.flatMap((app: Application, index: number) => [
                  new Paragraph({
                    text: `${index + 1}. ${app.companyName} - ${app.jobTitle}`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Status: ${app.status}`,
                        bold: true,
                      }),
                      new TextRun({
                        text: `\nApplied: ${app.appliedDate || "N/A"}`,
                        break: 1,
                      }),
                    ],
                  }),
                  new Paragraph({
                    text: app.jobDescription.substring(0, 200) + "...",
                    spacing: { after: 200 },
                  }),
                ]),
              ],
            },
          ],
        });

        const buffer = await Packer.toBuffer(docx);
        exportData = buffer;
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        filename = `applications-${timestamp}.docx`;
        break;
      }

      default: {
        return sendResponse(res, 400, { error: "Unsupported export format" });
      }
    }

    // Set headers for file download
    res.setHeader("Content-Type", `${contentType}; charset=utf-8`);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    if (!exportData) {
      return sendResponse(res, 500, { error: "Export data generation failed" });
    }

    // For binary data (PDF, DOCX)
    if (Buffer.isBuffer(exportData)) {
      res.setHeader("Content-Length", exportData.length);
      return res.status(200).send(exportData);
    }

    // For string data (JSON, CSV)
    res.setHeader("Content-Length", Buffer.byteLength(exportData, "utf8"));
    return res.status(200).send(exportData);
  } catch (error) {
    console.error("Export error:", error);
    return handleError(res, error, "Failed to export applications");
  }
});

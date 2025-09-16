// ===============================
// RUTAS DE VISTAS DE MEMBRESÍAS
// ===============================
import express from "express";
import { authMiddleware } from "../../login/middlewares/accessDenied.js";
import {
  renderMembershipHome,
  renderMembershipCreate,
  renderEditMembership,
  renderRenewMembership,
} from "../controllers/membershipController.js";
import { MembershipController } from "../controllers/createMemberController.js";
import { listMembershipController } from "../controllers/listMemberController.js";
import { editMemberController } from "../controllers/editMemberController.js";
import { deleteMemberController } from "../controllers/deleteMemberController.js";

const routerMembership = express.Router();

// Middleware global
routerMembership.use(authMiddleware);

// Helper para bind
const bind = (controller, method) => controller[method].bind(controller);

// Ruta para servir la imagen QR
routerMembership.get('/api/qr/:id_activa', async (req, res) => {
  try {
    const { id_activa } = req.params;
    const membresia = await MembershipModel.getMembresiaById(id_activa);
    
    if (!membresia || !membresia.qr_path) {
      return res.status(404).json({ error: "QR no encontrado" });
    }

    if (!fs.existsSync(membresia.qr_path)) {
      return res.status(404).json({ error: "Archivo QR no encontrado" });
    }

    // Servir el archivo directamente
    res.sendFile(path.resolve(membresia.qr_path));
    
  } catch (error) {
    console.error("Error al servir QR:", error);
    res.status(500).json({ error: "Error al obtener el QR" });
  }
});

// Ruta para descargar el QR
routerMembership.get('/download-qr/:id_activa', MembershipController.downloadQR);

// Vistas
routerMembership.get("/", renderMembershipHome);
routerMembership.get("/createMembership", renderMembershipCreate);
routerMembership.get("/editMembership/:id", renderEditMembership);
routerMembership.get("/renew/:id", renderRenewMembership);
routerMembership.get(
  "/createMembership/tipos",
  bind(MembershipController, "renderTiposMembresia")
);

// Acciones CRUD
routerMembership.get(
  "/listMembership",
  bind(listMembershipController, "renderMembershipList")
);
routerMembership.post(
  "/createClient",
  bind(MembershipController, "createClient")
);
routerMembership.post(
  "/createMembership",
  bind(MembershipController, "createMembership")
);
routerMembership.get('/editMembership/:id', editMemberController.editMembership);
routerMembership.post('/updateMembership/:id', editMemberController.updateMembership);
routerMembership.post("/renew/:id", editMemberController.renewMembership);
routerMembership.delete("/delete/:id", deleteMemberController.deleteMembership);


// Ruta con verificación de método existente
routerMembership.get("/tipos_membresia/:id", (req, res) => {
  if (MembershipController.getTipoMembresiaById) {
    return MembershipController.getTipoMembresiaById(req, res);
  }
  res.status(501).json({ error: "Not implemented" });
});

export { routerMembership as membershipRoutes };

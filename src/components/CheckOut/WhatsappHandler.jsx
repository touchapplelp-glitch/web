import React, { useEffect } from "react";

/**
 * WhatsappHandler
 *
 * Entradas:
 * - cart: array de productos
 * - orderId: ID de orden generada
 *
 * Salida:
 * - Redirección automática a WhatsApp con mensaje preformateado
 *
 * Consumido por:
 * - Checkout / Order confirmation
 */

const WhatsappHandler = ({ cart = [], orderId }) => {
  // Número del negocio desde entorno
  const ownerPhoneNumber =
    import.meta.env.VITE_STORE_WHATSAPP || "";

  const generateWhatsAppMessage = () => {
    const message = cart
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} = $${item.price * item.quantity}`
      )
      .join("%0A");

    return `Hola, quiero comprar estos productos:%0A${message}%0A%0AOrden ID: ${orderId}`;
  };

  const handleRedirectToWhatsApp = () => {
    if (!ownerPhoneNumber) {
      console.error("WhatsApp number is missing in .env");
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappLink = `https://wa.me/${ownerPhoneNumber}?text=${message}`;

    window.open(whatsappLink, "_blank");
  };

  useEffect(() => {
    // Evita ejecución prematura
    if (!orderId || cart.length === 0) return;

    handleRedirectToWhatsApp();
  }, [orderId, cart]);

  return null;
};

export default WhatsappHandler;
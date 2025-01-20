export const getTagColor = (status: string) => {
  let color;
  switch (status) {
    case "Vigente":
      color = "#17CC07";
      break;
    case "En auditoria":
      color = "#649EEE";
      break;
    case "Pendiente":
      color = "#FF5C00";
      break;
    case "Rechazado":
      color = "#E53261";
      break;
    default:
      color = "black";
  }
  return color;
};

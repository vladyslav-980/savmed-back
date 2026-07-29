const appointmentTypeLabels = {
  consultation: "Консультація",
  treatment: "Лікування",
};

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Kyiv",
  }).format(new Date(date));
};

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const createCancellationUrl = (cancellationToken) => {
  if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not configured");
  }

  const cancellationUrl = new URL(
    "/cancel-appointment",
    process.env.FRONTEND_URL,
  );

  cancellationUrl.searchParams.set("token", cancellationToken);

  return cancellationUrl.toString();
};

export const createClientAppointmentEmail = ({
  clientName,
  type,
  startAt,
  endAt,
  cancellationToken,
}) => {
  const safeClientName = escapeHtml(clientName);
  const appointmentType =
    appointmentTypeLabels[type] || "Медичний прийом";

  const cancellationUrl = escapeHtml(
    createCancellationUrl(cancellationToken),
  );

  return {
    subject: `Запис підтверджено — ${appointmentType}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h1 style="color: #0f766e;">Ваш запис підтверджено</h1>

        <p>Вітаємо, ${safeClientName}!</p>

        <p>Ви успішно записані на прийом у SavMed.</p>

        <ul>
          <li><strong>Послуга:</strong> ${appointmentType}</li>
          <li><strong>Початок:</strong> ${formatDateTime(startAt)}</li>
          <li><strong>Завершення:</strong> ${formatDateTime(endAt)}</li>
        </ul>

        <p>
          Якщо ваші плани змінилися, натисніть кнопку нижче:
        </p>

        <p>
          <a
            href="${cancellationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              color: #ffffff;
              background-color: #dc2626;
              border-radius: 6px;
              text-decoration: none;
            "
          >
            Скасувати запис
          </a>
        </p>

        <p style="color: #6b7280; font-size: 14px;">
          Якщо ви не створювали цей запис, скористайтеся кнопкою скасування.
        </p>
      </div>
    `,
  };
};

export const createDoctorAppointmentEmail = ({
  clientName,
  clientPhone,
  clientEmail,
  type,
  startAt,
  endAt,
}) => {
  const safeClientName = escapeHtml(clientName);
  const safeClientPhone = escapeHtml(clientPhone);
  const safeClientEmail = escapeHtml(clientEmail);

  const appointmentType =
    appointmentTypeLabels[type] || "Медичний прийом";

  return {
    subject: `Новий запис: ${appointmentType} — ${safeClientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h1 style="color: #0f766e;">Новий запис у SavMed</h1>

        <ul>
          <li><strong>Клієнт:</strong> ${safeClientName}</li>
          <li><strong>Телефон:</strong> ${safeClientPhone}</li>
          <li><strong>Email:</strong> ${safeClientEmail}</li>
          <li><strong>Послуга:</strong> ${appointmentType}</li>
          <li><strong>Початок:</strong> ${formatDateTime(startAt)}</li>
          <li><strong>Завершення:</strong> ${formatDateTime(endAt)}</li>
        </ul>
      </div>
    `,
  };
};

export const createClientAppointmentCancelledEmail = ({
  clientName,
  type,
  startAt,
  endAt,
}) => {
  const safeClientName = escapeHtml(clientName);

  const appointmentType =
    appointmentTypeLabels[type] || "Медичний прийом";

  return {
    subject: `Запис скасовано — ${appointmentType}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h1 style="color: #dc2626;">Ваш запис скасовано</h1>

        <p>Вітаємо, ${safeClientName}.</p>

        <p>Ваш запис у SavMed було успішно скасовано.</p>

        <ul>
          <li><strong>Послуга:</strong> ${appointmentType}</li>
          <li><strong>Початок:</strong> ${formatDateTime(startAt)}</li>
          <li><strong>Завершення:</strong> ${formatDateTime(endAt)}</li>
        </ul>

        <p>
          Цей час знову доступний для запису інших клієнтів.
        </p>
      </div>
    `,
  };
};

export const createDoctorAppointmentCancelledEmail = ({
  clientName,
  clientPhone,
  clientEmail,
  type,
  startAt,
  endAt,
  cancellationReason,
}) => {
  const safeClientName = escapeHtml(clientName);
  const safeClientPhone = escapeHtml(clientPhone);
  const safeClientEmail = escapeHtml(clientEmail);

  const safeCancellationReason = escapeHtml(
    cancellationReason || "Причину не вказано",
  );

  const appointmentType =
    appointmentTypeLabels[type] || "Медичний прийом";

  return {
    subject: `Клієнт скасував запис — ${safeClientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h1 style="color: #dc2626;">Запис скасовано клієнтом</h1>

        <ul>
          <li><strong>Клієнт:</strong> ${safeClientName}</li>
          <li><strong>Телефон:</strong> ${safeClientPhone}</li>
          <li><strong>Email:</strong> ${safeClientEmail}</li>
          <li><strong>Послуга:</strong> ${appointmentType}</li>
          <li><strong>Початок:</strong> ${formatDateTime(startAt)}</li>
          <li><strong>Завершення:</strong> ${formatDateTime(endAt)}</li>
          <li><strong>Причина:</strong> ${safeCancellationReason}</li>
        </ul>

        <p>
          Час прийому знову доступний для запису.
        </p>
      </div>
    `,
  };
};
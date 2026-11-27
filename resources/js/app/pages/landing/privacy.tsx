import { Link } from '@inertiajs/react';
import { terms } from '@/routes/legal';
import { ContactChannels, LegalPage } from './components/legal-page';
import { days, useLegalProps } from './use-legal-props';
import type { LegalSection } from './use-legal-props';
import { useWhatsappLeadTracking } from './use-whatsapp-link';

const CONTACT_MESSAGE = 'Hola 👋 Quiero hacer una solicitud sobre mis datos personales en Convite.';

export function PrivacyPage() {
    useWhatsappLeadTracking();
    const { legal, retention } = useLegalProps();
    const requestChannel = legal.email ? (
        <>
            al correo <a href={`mailto:${legal.email}`}>{legal.email}</a>
        </>
    ) : (
        'por los medios de contacto indicados al final de este aviso'
    );

    const sections: LegalSection[] = [
        {
            id: 'responsable',
            title: 'Responsable',
            content: (
                <>
                    <p>
                        <strong>{legal.name}</strong>
                        {legal.name !== 'Convite' && <>, que presta sus servicios con el nombre comercial Convite</>}
                        {legal.address && <>, con domicilio en {legal.address}</>}, es responsable del tratamiento de los datos
                        personales que se describen en este aviso, conforme a la Ley Federal de Protección de Datos Personales en
                        Posesión de los Particulares y demás normativa aplicable.
                    </p>
                    <p>Para cualquier asunto relacionado con sus datos personales puede contactarnos:</p>
                    <ContactChannels message={CONTACT_MESSAGE} />
                </>
            ),
        },
        {
            id: 'datos',
            title: 'Datos personales que tratamos',
            content: (
                <>
                    <p>
                        <strong>De nuestros clientes</strong> (quien contrata una invitación o servicio):
                    </p>
                    <ul>
                        <li>nombre, teléfono y correo electrónico;</li>
                        <li>
                            los datos del evento que nos proporciona para la invitación: nombres de los festejados y de sus familiares o
                            padrinos, fecha, horarios, lugares, fotos, música, textos y datos de mesa de regalos;
                        </li>
                        <li>datos del pedido y de los pagos (montos, fechas y forma de pago);</li>
                        <li>
                            si tiene acceso al panel: su cuenta de usuario (nombre, correo y contraseña cifrada) y, si las activa, sus
                            llaves de acceso o verificación en dos pasos.
                        </li>
                    </ul>
                    <p>
                        <strong>De los invitados</strong>, cuando el plan incluye lista de invitados, confirmación en línea u otras
                        funciones para invitados:
                    </p>
                    <ul>
                        <li>
                            nombre, número de lugares, mesa asignada, teléfono y correo electrónico, que nos proporciona el anfitrión;
                        </li>
                        <li>
                            su respuesta de asistencia, el número de personas que confirma y el mensaje que deje, en su caso;
                        </li>
                        <li>
                            la fecha en que se le envió la invitación, la primera vez que abrió su enlace personalizado y, el día del
                            evento, su registro de llegada;
                        </li>
                        <li>los mensajes que escriba en el libro de buenos deseos, con el nombre con que los firme;</li>
                        <li>las fotos que comparta en la galería en vivo.</li>
                    </ul>
                    <p>
                        <strong>De los visitantes del sitio</strong>: datos de navegación (páginas visitadas, tipo de dispositivo y
                        navegador, ubicación aproximada y origen de la visita), solo si aceptan las cookies de análisis, y los
                        necesarios para el funcionamiento del sitio (ver la sección de cookies).
                    </p>
                    <p>
                        No solicitamos datos personales sensibles. Le pedimos no incluirlos en los textos, mensajes o fotos que
                        comparta.
                    </p>
                </>
            ),
        },
        {
            id: 'finalidades',
            title: 'Para qué usamos sus datos',
            content: (
                <>
                    <p>
                        <strong>Finalidades necesarias</strong> para prestar el servicio:
                    </p>
                    <ul>
                        <li>cotizar, contratar, diseñar, publicar y dar soporte a la invitación y los servicios contratados;</li>
                        <li>mostrar en la invitación la información del evento que el cliente nos proporciona;</li>
                        <li>
                            enviar las invitaciones a los invitados, recibir sus confirmaciones y mostrarlas al anfitrión en su panel,
                            incluido un resumen diario por correo, que puede desactivar desde su perfil;
                        </li>
                        <li>registrar la llegada de los invitados en la puerta y operar la galería en vivo y el libro de buenos deseos;</li>
                        <li>
                            administrar los pedidos, pagos, recomendaciones y comisiones de aliados, y cumplir obligaciones legales y
                            fiscales;
                        </li>
                        <li>proteger la seguridad del sitio, prevenir abusos y respaldar la información.</li>
                    </ul>
                    <p>
                        <strong>Finalidades adicionales</strong>, que no son necesarias para el servicio:
                    </p>
                    <ul>
                        <li>medir el uso del sitio y de las invitaciones para mejorarlos, solo con su consentimiento;</li>
                        <li>enviarle promociones o encuestas de satisfacción;</li>
                        <li>mostrar su invitación como ejemplo de nuestro trabajo, solo con su autorización expresa.</li>
                    </ul>
                    <p>
                        Si no desea que tratemos sus datos para las finalidades adicionales, puede indicarlo en cualquier momento{' '}
                        {requestChannel}. Su negativa no afectará el servicio contratado.
                    </p>
                </>
            ),
        },
        {
            id: 'invitados',
            title: 'Información para los invitados',
            content: (
                <>
                    <p>
                        Si usted recibió una invitación de Convite, sus datos nos los proporcionó el anfitrión del evento, y los
                        tratamos únicamente para hacerle llegar la invitación y gestionar su asistencia por encargo del anfitrión.
                        En particular:
                    </p>
                    <ul>
                        <li>
                            Su enlace personalizado lo identifica: al abrirlo, el anfitrión puede ver que lo abrió, y su confirmación,
                            con el mensaje que deje, queda a nombre de su invitación.
                        </li>
                        <li>
                            En la puerta, el código QR de su pase identifica a su invitación para registrar su llegada.
                        </li>
                        <li>
                            Las fotos que comparta en la galería en vivo pueden proyectarse en el lugar del evento y el anfitrión puede
                            descargarlas. Al subirlas eliminamos sus metadatos (como la ubicación y el modelo del teléfono).
                        </li>
                        <li>
                            Los mensajes del libro de buenos deseos los lee el anfitrión y, si así lo eligió, los demás invitados; el
                            anfitrión puede descargarlos en un PDF.
                        </li>
                    </ul>
                    <p>
                        Puede pedir al anfitrión, o a nosotros, que corrija o elimine sus datos, o que retire una foto o mensaje suyo.
                    </p>
                </>
            ),
        },
        {
            id: 'proveedores',
            title: 'Proveedores y transferencias',
            content: (
                <>
                    <p>
                        Para prestar el servicio nos apoyamos en proveedores que tratan los datos por nuestra cuenta y conforme a
                        nuestras instrucciones, y que pueden estar ubicados fuera de México:
                    </p>
                    <ul>
                        <li>proveedores de alojamiento del sitio y de la base de datos;</li>
                        <li>proveedores de envío de correo electrónico;</li>
                        <li>Google, para almacenar los respaldos (Google Drive) y, solo con su consentimiento, medir visitas (Google Analytics).</li>
                    </ul>
                    <p>
                        Cuando usted o el anfitrión eligen comunicarse por WhatsApp, esa comunicación se rige por las políticas de
                        WhatsApp. Los mapas de los lugares del evento se muestran con Google Maps.
                    </p>
                    <p>
                        No vendemos ni compartimos sus datos con terceros para sus propios fines. Solo los transferiremos sin su
                        consentimiento en los casos que permite la ley, por ejemplo, cuando lo requiera una autoridad competente.
                    </p>
                </>
            ),
        },
        {
            id: 'conservacion',
            title: 'Cuánto tiempo conservamos los datos',
            content: (
                <>
                    <ul>
                        <li>
                            Los datos de los invitados (lista, confirmaciones, registros de llegada y mensajes del libro de buenos
                            deseos) se eliminan automáticamente {days(retention.guests_days)} después del evento.
                        </li>
                        <li>
                            Las fotos, la música y las fotos de la galería en vivo de una invitación retirada se eliminan{' '}
                            {days(retention.uploads_days)} después del evento.
                        </li>
                        <li>Los respaldos se conservan {days(retention.backups_days)} y después se eliminan.</li>
                        <li>
                            Los datos de los clientes, sus pedidos y pagos se conservan mientras dure la relación y, después, el tiempo
                            que exijan las obligaciones legales y fiscales aplicables.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 'cookies',
            title: 'Cookies y tecnologías similares',
            content: (
                <>
                    <p>Este sitio y las invitaciones usan:</p>
                    <ul>
                        <li>
                            <strong>Cookies necesarias</strong>: la sesión y la protección de formularios, la del personal que registra
                            llegadas en la puerta del evento, y las que recuerdan el código de recomendación de un cliente
                            o de un aliado para aplicar su descuento (durante {days(retention.referral_cookie_days)} y{' '}
                            {days(retention.partner_cookie_days)}, respectivamente).
                        </li>
                        <li>
                            <strong>Almacenamiento local del navegador</strong>, para recordar su elección sobre las cookies de análisis
                            y algunas preferencias de la invitación (por ejemplo, su respuesta en la dinámica «¿niño o niña?»).
                        </li>
                        <li>
                            <strong>Cookies de análisis</strong> de Google Analytics, solo si las acepta en el aviso de cookies. En las
                            invitaciones no enviamos a Google los nombres de los festejados ni los enlaces personalizados de los
                            invitados.
                        </li>
                    </ul>
                    <p>
                        Puede rechazar las cookies de análisis en el aviso de cookies y borrar las cookies desde la configuración de
                        su navegador; si borra las necesarias, algunas funciones podrían no operar.
                    </p>
                </>
            ),
        },
        {
            id: 'derechos-arco',
            title: 'Derechos ARCO',
            content: (
                <>
                    <p>
                        Usted tiene derecho a <strong>acceder</strong> a sus datos personales, <strong>rectificarlos</strong> si son
                        inexactos, <strong>cancelarlos</strong> cuando considere que no se requieren para las finalidades señaladas,
                        y <strong>oponerse</strong> a su tratamiento para fines específicos (derechos ARCO).
                    </p>
                    <p>Para ejercerlos, envíe su solicitud {requestChannel}, con:</p>
                    <ul>
                        <li>su nombre y un medio para comunicarle la respuesta;</li>
                        <li>un documento que acredite su identidad o, en su caso, la de su representante legal;</li>
                        <li>una descripción clara de los datos y del derecho que desea ejercer;</li>
                        <li>en caso de rectificación, la corrección que solicita.</li>
                    </ul>
                    <p>
                        Le responderemos en un plazo máximo de 20 días hábiles y, si procede, haremos efectiva la solicitud dentro de
                        los 15 días hábiles siguientes a la respuesta.
                    </p>
                </>
            ),
        },
        {
            id: 'revocacion',
            title: 'Revocación del consentimiento y limitación del uso',
            content: (
                <p>
                    Puede revocar su consentimiento o pedir que limitemos el uso o divulgación de sus datos con el mismo procedimiento
                    de los derechos ARCO. Tenga en cuenta que, si revoca el consentimiento para una finalidad necesaria, podríamos no
                    poder seguir prestando el servicio. Los clientes con acceso al panel pueden además desactivar el resumen diario de
                    confirmaciones desde su perfil.
                </p>
            ),
        },
        {
            id: 'menores',
            title: 'Menores de edad',
            content: (
                <p>
                    Nuestros servicios se contratan por personas mayores de edad. Cuando una invitación incluye datos o fotos de
                    menores (por ejemplo, en XV años, bautizos o fiestas infantiles), el cliente declara contar con el consentimiento
                    de su madre, padre o tutor.
                </p>
            ),
        },
        {
            id: 'seguridad',
            title: 'Seguridad',
            content: (
                <p>
                    Aplicamos medidas administrativas, técnicas y físicas para proteger sus datos: conexiones cifradas, contraseñas
                    almacenadas de forma cifrada, verificación en dos pasos y llaves de acceso disponibles para el panel, acceso
                    limitado a cada cliente sobre sus propias invitaciones, enlaces de invitados, puerta y galería que no pueden
                    adivinarse y que el anfitrión puede revocar, y respaldos periódicos.
                </p>
            ),
        },
        {
            id: 'cambios',
            title: 'Cambios a este aviso',
            content: (
                <p>
                    Podemos modificar este aviso para atender cambios legales o en nuestros servicios. La versión vigente siempre
                    estará publicada en esta página con su fecha de actualización.
                </p>
            ),
        },
        {
            id: 'autoridad',
            title: 'Autoridad',
            content: (
                <>
                    <p>
                        Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede acudir a la
                        autoridad competente en la materia, actualmente la Secretaría Anticorrupción y Buen Gobierno.
                    </p>
                    <p>
                        Consulte también nuestros <Link href={terms()}>términos y condiciones</Link>.
                    </p>
                </>
            ),
        },
    ];

    return (
        <LegalPage
            title="Aviso de privacidad"
            eyebrow="Legal"
            updatedAt="27 de noviembre de 2026"
            intro={
                <p>
                    En Convite cuidamos los datos personales de quienes nos confían su evento y de sus invitados. Este aviso explica
                    qué datos tratamos, para qué, con quién los compartimos, cuánto tiempo los conservamos y cómo puede ejercer sus
                    derechos.
                </p>
            }
            sections={sections}
        />
    );
}

export default PrivacyPage;

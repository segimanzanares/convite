import { Link } from '@inertiajs/react';
import { DELIVERY_TIME } from '@/lib/services';
import { landing, services } from '@/routes';
import { privacy } from '@/routes/legal';
import { ContactChannels, LegalPage } from './components/legal-page';
import { days, useLegalProps } from './use-legal-props';
import type { LegalSection } from './use-legal-props';
import { useWhatsappLeadTracking } from './use-whatsapp-link';

export function TermsPage() {
    useWhatsappLeadTracking();
    const { legal, retention } = useLegalProps();

    const sections: LegalSection[] = [
        {
            id: 'servicio',
            title: 'El servicio',
            content: (
                <>
                    <p>
                        Convite diseña y publica <strong>invitaciones digitales</strong> para bodas, XV años, bautizos, baby showers,
                        revelaciones de género, cumpleaños y otros eventos. Cada invitación tiene su propio enlace, listo para
                        compartirse por WhatsApp, redes sociales o correo, y muestra la información que el Cliente nos proporciona
                        (nombres, fecha, lugares, programa, fotos, música, entre otros).
                    </p>
                    <p>
                        Según el plan contratado, el servicio puede incluir: lista de invitados con enlaces personalizados,
                        confirmación de asistencia en línea, acceso a un panel para el Cliente, tarjeta y pases imprimibles,
                        registro de llegada en la puerta con código QR, galería de fotos en vivo, libro de buenos deseos y diseño
                        exclusivo. Las funciones de cada plan son las que se describen en la{' '}
                        <Link href={`${landing.url()}#planes`}>sección de planes</Link> al momento de contratar, y quedan fijas para
                        ese pedido aunque el plan cambie después.
                    </p>
                    <p>
                        También ofrecemos <Link href={services()}>servicios adicionales</Link>, como video semblanza, invitación en
                        video e imprimibles personalizados, que se rigen por estos mismos términos.
                    </p>
                </>
            ),
        },
        {
            id: 'contratacion',
            title: 'Cotización, contratación y pagos',
            content: (
                <>
                    <p>
                        La contratación se hace por WhatsApp u otro medio de contacto directo. Convite envía una cotización con el
                        plan o servicio, su precio y las condiciones de pago; el pedido queda contratado cuando el Cliente la acepta
                        y realiza el primer pago acordado.
                    </p>
                    <ul>
                        <li>Los precios se expresan en pesos mexicanos (MXN).</li>
                        <li>Los pagos se reciben por transferencia bancaria, en efectivo o por el medio que se indique en la cotización.</li>
                        <li>
                            Cuando la cotización contemple un anticipo, comenzamos a trabajar al recibirlo junto con la información del
                            evento. El saldo debe cubrirse antes de la entrega o publicación de la invitación, salvo que se acuerde otra
                            cosa por escrito.
                        </li>
                        <li>
                            Los descuentos (por ejemplo, por recomendación de otro cliente o de un aliado de Convite) se aplican sobre
                            el precio al cotizar, no son acumulables entre sí salvo que se indique lo contrario, y Convite puede
                            modificar o terminar estos programas en cualquier momento sin afectar los pedidos ya contratados.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 'materiales',
            title: 'Información y materiales del Cliente',
            content: (
                <>
                    <p>
                        El Cliente es responsable de que la información que nos entrega sea correcta y completa (nombres, fechas,
                        horarios, direcciones, datos de mesa de regalos, etc.), y de revisarla en la vista previa antes de compartir
                        la invitación.
                    </p>
                    <p>Al enviarnos fotos, música, textos o listas de invitados, el Cliente declara que:</p>
                    <ul>
                        <li>tiene derecho a usarlos y a autorizarnos a publicarlos en la invitación;</li>
                        <li>
                            cuenta con el consentimiento de las personas que aparecen en las fotos o se mencionan en la invitación
                            (padres, padrinos, abuelos, etc.) y, tratándose de menores de edad, con el de su madre, padre o tutor;
                        </li>
                        <li>
                            cuenta con el consentimiento de sus invitados para compartirnos sus nombres y datos de contacto con el fin
                            de enviarles la invitación y recibir su confirmación.
                        </li>
                    </ul>
                    <p>
                        Si el Cliente no tiene una canción con licencia para usarse, podemos sugerirle una alternativa. Convite no
                        se hace responsable por reclamaciones de terceros derivadas de los materiales que el Cliente proporcione.
                    </p>
                </>
            ),
        },
        {
            id: 'entrega',
            title: 'Entrega, revisiones y cambios',
            content: (
                <>
                    <ul>
                        <li>
                            Las invitaciones digitales se entregan, por lo general, entre 3 y 5 días hábiles después de recibir toda la
                            información y las fotos; los servicios adicionales, en {DELIVERY_TIME}. Los diseños exclusivos y las fechas
                            de temporada alta pueden requerir más tiempo, que se indicará en la cotización.
                        </li>
                        <li>
                            Cada pedido incluye <strong>dos rondas de ajustes</strong> sobre la propuesta entregada. Los cambios
                            adicionales, o los que impliquen un rediseño, pueden cotizarse por separado.
                        </li>
                        <li>
                            Después de publicada, corregimos sin costo los errores atribuibles a Convite. Los cambios de información que
                            el Cliente solicite (por ejemplo, un cambio de lugar u horario) se atienden en la medida de lo posible.
                        </li>
                        <li>
                            Los retrasos causados por información incompleta o por la falta de respuesta del Cliente recorren la fecha
                            de entrega.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 'cancelaciones',
            title: 'Cancelaciones y reembolsos',
            content: (
                <>
                    <ul>
                        <li>
                            Si el Cliente cancela antes de que comencemos a trabajar en su pedido, reembolsamos íntegramente lo pagado.
                        </li>
                        <li>
                            Una vez iniciado el diseño, el anticipo no es reembolsable, pues cubre el trabajo ya realizado.
                        </li>
                        <li>Una vez entregada o publicada la invitación, o entregado el servicio adicional, no hay reembolsos.</li>
                        <li>
                            Si Convite no pudiera entregar el pedido por causas que le sean imputables, reembolsará íntegramente lo
                            pagado.
                        </li>
                        <li>
                            Si el evento cambia de fecha, actualizamos la invitación sin costo dentro de las rondas de ajustes
                            incluidas.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 'vigencia',
            title: 'Vigencia de la invitación y conservación de datos',
            content: (
                <>
                    <p>
                        La invitación permanece en línea al menos hasta la fecha del evento. Después, Convite puede retirarla y
                        eliminar su información de acuerdo con estos plazos:
                    </p>
                    <ul>
                        <li>
                            La lista de invitados, sus confirmaciones, los registros de llegada y los mensajes del libro de buenos
                            deseos se eliminan {days(retention.guests_days)} después del evento.
                        </li>
                        <li>
                            El libro de buenos deseos recibe mensajes hasta {days(retention.wishes_days_after_event)} después del
                            evento.
                        </li>
                        <li>
                            Las fotos, la música y las fotos de la galería en vivo de una invitación retirada se eliminan{' '}
                            {days(retention.uploads_days)} después del evento.
                        </li>
                    </ul>
                    <p>
                        Es responsabilidad del Cliente descargar, desde su panel, las fotos de la galería en vivo, el libro de buenos
                        deseos en PDF y la lista de confirmaciones antes de que se eliminen. Una vez eliminados no es posible
                        recuperarlos.
                    </p>
                </>
            ),
        },
        {
            id: 'panel',
            title: 'Panel del Cliente',
            content: (
                <>
                    <p>
                        Los planes con lista de invitados o confirmación en línea incluyen una cuenta en el panel de Convite. El
                        Cliente es responsable de mantener la confidencialidad de su contraseña y de las acciones realizadas con su
                        cuenta, y puede activar la verificación en dos pasos desde su perfil.
                    </p>
                    <p>
                        Los enlaces de la puerta y de la galería en vivo dan acceso a quien los tenga; el Cliente decide con quién
                        los comparte y puede generar enlaces nuevos desde el panel, lo que invalida los anteriores.
                    </p>
                </>
            ),
        },
        {
            id: 'uso-aceptable',
            title: 'Uso aceptable',
            content: (
                <>
                    <p>
                        La invitación, la galería en vivo y el libro de buenos deseos deben usarse solo para el evento contratado. No
                        se permite publicar contenido ilegal, ofensivo, que infrinja derechos de terceros o que no tenga relación con
                        el evento.
                    </p>
                    <p>
                        El Cliente puede revisar, ocultar o eliminar las fotos y los mensajes que comparten sus invitados, y elegir
                        que se publiquen solo después de aprobarlos. Convite puede retirar cualquier contenido que contravenga estos
                        términos o la ley, y suspender el servicio en caso de uso indebido.
                    </p>
                </>
            ),
        },
        {
            id: 'propiedad-intelectual',
            title: 'Propiedad intelectual',
            content: (
                <>
                    <p>
                        Los diseños, ilustraciones, código y demás elementos de las plantillas de Convite son propiedad de{' '}
                        {legal.name}. Al contratar, el Cliente obtiene una licencia para usar su invitación y los imprimibles
                        únicamente para su evento; no puede copiarlos, revenderlos ni usarlos para otros eventos o clientes.
                    </p>
                    <p>
                        Los diseños exclusivos se hacen para un solo cliente y no se ofrecen a otros. Las fotos, textos y demás
                        materiales del Cliente siguen siendo suyos.
                    </p>
                    <p>
                        Toda invitación incluye al pie la leyenda «Hecho con cariño en Convite» con un enlace a nuestro sitio.
                        Convite solo mostrará una invitación de un cliente como ejemplo de su trabajo con la autorización de este.
                    </p>
                </>
            ),
        },
        {
            id: 'responsabilidad',
            title: 'Disponibilidad y responsabilidad',
            content: (
                <>
                    <p>
                        Hacemos lo posible por que las invitaciones estén disponibles en todo momento, pero el servicio depende de
                        internet, de proveedores de alojamiento y de servicios de terceros (como WhatsApp, Google Maps o el correo
                        electrónico) que no controlamos. Convite no es responsable por fallas de esos servicios, de la conexión o de
                        los dispositivos de los invitados, ni por la organización, realización o cancelación del evento.
                    </p>
                    <p>
                        En cualquier caso, la responsabilidad de Convite frente al Cliente se limita al monto pagado por el pedido de
                        que se trate.
                    </p>
                </>
            ),
        },
        {
            id: 'privacidad',
            title: 'Privacidad',
            content: (
                <p>
                    El tratamiento de los datos personales de clientes, invitados y visitantes se describe en nuestro{' '}
                    <Link href={privacy()}>aviso de privacidad</Link>, que forma parte de estos términos.
                </p>
            ),
        },
        {
            id: 'modificaciones',
            title: 'Modificaciones',
            content: (
                <p>
                    Convite puede actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de
                    actualización. Los pedidos contratados se rigen por los términos vigentes al momento de su contratación.
                </p>
            ),
        },
        {
            id: 'ley-aplicable',
            title: 'Ley aplicable y jurisdicción',
            content: (
                <p>
                    Estos términos se rigen por las leyes de los Estados Unidos Mexicanos, incluida la Ley Federal de Protección al
                    Consumidor. Para cualquier controversia, las partes se someten a los tribunales competentes de{' '}
                    {legal.city ?? 'el domicilio de Convite'}, sin perjuicio del derecho del Cliente de acudir a la Procuraduría
                    Federal del Consumidor (Profeco).
                </p>
            ),
        },
        {
            id: 'contacto',
            title: 'Contacto',
            content: (
                <>
                    <p>Para cualquier duda sobre estos términos o su pedido, escríbanos:</p>
                    <ContactChannels message="Hola 👋 Tengo una pregunta sobre los términos y condiciones de Convite." />
                </>
            ),
        },
    ];

    return (
        <LegalPage
            title="Términos y condiciones"
            eyebrow="Legal"
            updatedAt="27 de noviembre de 2026"
            intro={
                <p>
                    Estos términos regulan la contratación y el uso de los servicios de <strong>Convite</strong>
                    {legal.name !== 'Convite' && <>, prestados por {legal.name}</>} («Convite», «nosotros»), por parte de quien
                    contrata una invitación o servicio («el Cliente»), así como el uso de las invitaciones por sus invitados. Al
                    contratar o usar nuestros servicios, usted acepta estos términos.
                </p>
            }
            sections={sections}
        />
    );
}

export default TermsPage;

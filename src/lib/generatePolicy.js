import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  ShadingType,
  PageBreak,
} from 'docx'
import { saveAs } from 'file-saver'
import taxonomy from '../data/nonprofit-data-taxonomy.json'
import matrixData from '../data/handling-matrix.json'

/* ─── Color palette ──────────────────────────────────────────────────── */

const COLORS = {
  emerald: '166534',   // emerald-800
  emeraldLt: 'dcfce7', // emerald-100
  stone: '44403c',     // stone-700
  stoneLt: 'f5f5f4',   // stone-100
  white: 'ffffff',
  black: '1c1917',     // stone-900
  green: '16a34a',
  greenBg: 'f0fdf4',
  blue: '2563eb',
  blueBg: 'eff6ff',
  amber: 'd97706',
  amberBg: 'fffbeb',
  red: 'dc2626',
  redBg: 'fef2f2',
}

const TIER_SHADING = {
  T1: { color: COLORS.green, bg: COLORS.greenBg },
  T2: { color: COLORS.blue, bg: COLORS.blueBg },
  T3: { color: COLORS.amber, bg: COLORS.amberBg },
  T4: { color: COLORS.red, bg: COLORS.redBg },
}

/* ─── Shared helpers ─────────────────────────────────────────────────── */

const FONT = 'Calibri'
const BODY_SIZE = 22 // half-points (11pt)
const H1_SIZE = 28   // 14pt
const H2_SIZE = 24   // 12pt

function body(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: BODY_SIZE, ...opts })
}

function bodyParagraph(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [body(text)],
  })
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: H1_SIZE,
        bold: true,
        color: COLORS.emerald,
      }),
    ],
  })
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: H2_SIZE,
        bold: true,
        color: COLORS.stone,
      }),
    ],
  })
}

function bulletItem(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [body(text)],
  })
}

function numberedItem(text) {
  return new Paragraph({
    numbering: { reference: 'numbered-list', level: 0 },
    spacing: { after: 60 },
    children: [body(text)],
  })
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] })
}

function emptyParagraph() {
  return new Paragraph({ spacing: { after: 60 }, children: [] })
}

/* ─── Table helpers ──────────────────────────────────────────────────── */

// Page: 8.5in = 12240 DXA, margins 1in each = 1440 DXA each, usable = 9360 DXA
const PAGE_WIDTH_DXA = 9360

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
  left: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
}

// Convert percentage array to DXA array for Table columnWidths
function colWidths(pcts) {
  return pcts.map(p => Math.round((p / 100) * PAGE_WIDTH_DXA))
}

// width is a percentage (e.g. 15 = 15%), converted to DXA
function headerCell(text, shading = COLORS.emerald, width) {
  const dxa = width ? Math.round((width / 100) * PAGE_WIDTH_DXA) : undefined
  return new TableCell({
    width: dxa ? { size: dxa, type: WidthType.DXA } : undefined,
    shading: { type: ShadingType.SOLID, color: shading },
    borders: TABLE_BORDERS,
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text,
            font: FONT,
            size: 20,
            bold: true,
            color: COLORS.white,
          }),
        ],
      }),
    ],
  })
}

function textCell(text, shading, width) {
  const dxa = width ? Math.round((width / 100) * PAGE_WIDTH_DXA) : undefined
  return new TableCell({
    width: dxa ? { size: dxa, type: WidthType.DXA } : undefined,
    shading: shading
      ? { type: ShadingType.SOLID, color: shading }
      : undefined,
    borders: TABLE_BORDERS,
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [body(text)],
      }),
    ],
  })
}

/* ─── Section builders ───────────────────────────────────────────────── */

function buildCoverSection(ws) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return [
    emptyParagraph(),
    emptyParagraph(),
    emptyParagraph(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: ws.orgName,
          font: FONT,
          size: 52,
          bold: true,
          color: COLORS.emerald,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'Data Classification & Handling Policy',
          font: FONT,
          size: 36,
          color: COLORS.stone,
        }),
      ],
    }),
    emptyParagraph(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        body(`Generated ${today}`, { color: '78716c' }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        body('Prepared with the Nonprofit Data Classification Guide — nptogether.org', {
          color: '78716c',
          italics: true,
        }),
      ],
    }),
    pageBreak(),
  ]
}

function buildPurposeSection(ws) {
  return [
    heading1('1. Purpose & Scope'),
    heading2('1.1 Purpose'),
    bodyParagraph(
      'Data classification is the foundation of effective information security. By categorizing data based on its sensitivity and the potential impact of unauthorized disclosure, organizations can apply appropriate protections proportional to risk. This policy establishes a consistent framework for classifying and handling all data created, collected, stored, processed, or transmitted by the organization.'
    ),
    bodyParagraph(
      'Without data classification, organizations tend to either under-protect sensitive information (creating risk) or over-protect everything (creating friction that staff work around). A tiered approach ensures that the most sensitive data receives the strongest protections while everyday operational information remains accessible.'
    ),
    heading2('1.2 Scope'),
    bodyParagraph(
      `This policy applies to all employees, contractors, volunteers, and partners of ${ws.orgName} who create, access, store, or transmit organizational data. It covers data in all formats — digital files, emails, databases, paper documents, and verbal communications.`
    ),
    heading2('1.3 Standards References'),
    bulletItem('NIST SP 800-60: Guide for Mapping Types of Information and Information Systems to Security Categories'),
    bulletItem('CIS Controls v8.1: Implementation Group guidance for nonprofit organizations'),
    bulletItem('Nonprofit sector best practices for data stewardship and privacy'),
    pageBreak(),
  ]
}

function buildTierSection() {
  const tiers = taxonomy.tiers
  const tierOrder = ['T1', 'T2', 'T3', 'T4']

  const rows = [
    new TableRow({
      children: [
        headerCell('Tier', COLORS.emerald, 15),
        headerCell('Name', COLORS.emerald, 15),
        headerCell('Description', COLORS.emerald, 40),
        headerCell('Risk if Disclosed', COLORS.emerald, 15),
        headerCell('Access Default', COLORS.emerald, 15),
      ],
    }),
    ...tierOrder.map(
      (tid) =>
        new TableRow({
          children: [
            textCell(tid, TIER_SHADING[tid].bg, 15),
            textCell(tiers[tid].label, TIER_SHADING[tid].bg, 15),
            textCell(tiers[tid].description, undefined, 40),
            textCell(tiers[tid].riskIfDisclosed, undefined, 15),
            textCell(tiers[tid].accessDefault, undefined, 15),
          ],
        })
    ),
  ]

  return [
    heading1('2. Classification Tiers'),
    bodyParagraph(
      'All organizational data is classified into one of four tiers based on the potential impact of unauthorized disclosure:'
    ),
    new Table({
      width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: colWidths([15, 15, 40, 15, 15]),
      rows,
    }),
    emptyParagraph(),
    bodyParagraph(
      'When in doubt about a data type\'s classification, apply the higher tier. It is always safer to over-classify than to under-classify.'
    ),
    pageBreak(),
  ]
}

function buildInventorySection(ws) {
  // Group selected types by category
  const byCat = {}
  for (const dt of ws.selectedDataTypes) {
    if (!byCat[dt.categoryId]) byCat[dt.categoryId] = []
    byCat[dt.categoryId].push(dt)
  }

  // Build regulation lookup for each data type
  const regLookup = {}
  for (const cat of taxonomy.categories) {
    for (const dt of cat.dataTypes) {
      regLookup[`${cat.id}::${dt.name}`] = (dt.regulations || []).join(', ')
    }
  }

  const sections = [
    heading1('3. Data Inventory'),
    bodyParagraph(
      `The following data types have been identified as relevant to ${ws.orgName}\'s operations. Each is assigned a classification tier based on sensitivity and regulatory requirements.`
    ),
  ]

  for (const cat of taxonomy.categories) {
    const catTypes = byCat[cat.id]
    if (!catTypes || catTypes.length === 0) continue

    sections.push(heading2(cat.name))

    const rows = [
      new TableRow({
        children: [
          headerCell('Data Type', COLORS.emerald, 50),
          headerCell('Tier', COLORS.emerald, 20),
          headerCell('Regulations', COLORS.emerald, 30),
        ],
      }),
      ...catTypes.map(
        (dt) =>
          new TableRow({
            children: [
              textCell(dt.dataTypeName, undefined, 50),
              textCell(
                `${dt.tier} — ${taxonomy.tiers[dt.tier]?.label || ''}`,
                TIER_SHADING[dt.tier]?.bg,
                20
              ),
              textCell(
                regLookup[`${dt.categoryId}::${dt.dataTypeName}`] || 'None',
                undefined,
                30
              ),
            ],
          })
      ),
    ]

    sections.push(
      new Table({ width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA }, columnWidths: colWidths([50, 20, 30]), rows })
    )
    sections.push(emptyParagraph())
  }

  sections.push(pageBreak())
  return sections
}

function buildHandlingSection() {
  const controls = matrixData.controls
  const tierOrder = ['T1', 'T2', 'T3', 'T4']
  const tierLabels = { T1: 'Public', T2: 'Internal', T3: 'Confidential', T4: 'Restricted' }
  const tierHeaderColors = {
    T1: COLORS.green,
    T2: COLORS.blue,
    T3: COLORS.amber,
    T4: COLORS.red,
  }

  const sections = [
    heading1('4. Handling Requirements'),
    bodyParagraph(
      'The following table defines the minimum controls required for each classification tier. Staff must follow these requirements when creating, storing, sharing, or disposing of data.'
    ),
  ]

  const rows = [
    new TableRow({
      children: [
        headerCell('Control', COLORS.emerald, 20),
        ...tierOrder.map((t) =>
          headerCell(tierLabels[t], tierHeaderColors[t], 20)
        ),
      ],
    }),
    ...controls.map(
      (control) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: Math.round(0.20 * PAGE_WIDTH_DXA), type: WidthType.DXA },
              borders: TABLE_BORDERS,
              shading: { type: ShadingType.SOLID, color: COLORS.stoneLt },
              children: [
                new Paragraph({
                  spacing: { before: 40, after: 40 },
                  children: [body(control.name, { bold: true, size: 18 })],
                }),
              ],
            }),
            ...tierOrder.map((t) =>
              textCell(
                control.tiers[t]?.label || '',
                TIER_SHADING[t].bg,
                20
              )
            ),
          ],
        })
    ),
  ]

  sections.push(
    new Table({ width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA }, columnWidths: colWidths([20, 20, 20, 20, 20]), rows })
  )
  sections.push(pageBreak())
  return sections
}

function buildPlatformSection(ws) {
  const sections = [heading1('5. Platform-Specific Controls')]

  if (ws.platform === 'google') {
    const tier = ws.workspaceTier
    sections.push(heading2('5.1 Google Workspace Configuration'))
    sections.push(
      bodyParagraph(
        `${ws.orgName} uses Google Workspace. The following controls are available and recommended at your current tier.`
      )
    )

    const capabilities = {
      free: {
        available: [
          'Basic 2-Step Verification for all accounts',
          'Google Drive sharing controls (restrict external sharing)',
          'Gmail confidential mode for sensitive emails',
          'Security alerts and notifications',
          'Mobile device basic management',
          'Group-based access control via Google Groups',
        ],
        upgradeGains: [
          'Google Vault for eDiscovery and retention (Business Standard+)',
          'Google Drive labels for classification (Business Standard+)',
          'DLP rules for Gmail and Drive (Business Standard+)',
          'Advanced endpoint management (Business Plus+)',
          'Context-aware access policies (Enterprise Standard)',
          'Security investigation tool (Enterprise Standard)',
          'S/MIME for email encryption (Enterprise Standard)',
        ],
      },
      business_standard: {
        available: [
          'All free-tier controls',
          'Google Vault for data retention and eDiscovery',
          'Google Drive labels — apply classification labels to all files',
          'DLP rules for Gmail and Drive content scanning',
          'Enhanced admin and audit logs',
          'Target audience for link sharing controls',
        ],
        upgradeGains: [
          'Advanced endpoint management with device approval (Business Plus)',
          'Context-aware access policies (Enterprise Standard)',
          'Security investigation tool for incident response (Enterprise Standard)',
          'S/MIME for end-to-end email encryption (Enterprise Standard)',
          'Advanced DLP with OCR scanning (Enterprise Standard)',
        ],
      },
      business_plus: {
        available: [
          'All Business Standard controls',
          'Advanced endpoint management with device approval and wipe',
          'App access control — restrict which apps can access data',
          'Enhanced mobile device management policies',
          'Google Vault advanced search and holds',
        ],
        upgradeGains: [
          'Context-aware access policies (Enterprise Standard)',
          'Security investigation tool for incident response (Enterprise Standard)',
          'S/MIME for end-to-end email encryption (Enterprise Standard)',
          'Advanced DLP with OCR scanning (Enterprise Standard)',
          'Data regions for compliance (Enterprise Standard)',
        ],
      },
      enterprise_standard: {
        available: [
          'All Business Plus controls',
          'Context-aware access — restrict access based on device, location, and risk',
          'Security investigation tool — investigate threats across Gmail, Drive, and users',
          'S/MIME encryption for email',
          'Advanced DLP with OCR scanning across Gmail and Drive',
          'Data regions for regulatory compliance',
          'Advanced security reports and dashboards',
          'BigQuery export for security log analysis',
        ],
        upgradeGains: [],
      },
    }

    const cap = capabilities[tier] || capabilities.free

    sections.push(heading2('Available at Your Current Tier'))
    for (const item of cap.available) {
      sections.push(bulletItem(item))
    }

    if (cap.upgradeGains.length > 0) {
      sections.push(heading2('Additional Controls Available with Upgrade'))
      for (const item of cap.upgradeGains) {
        sections.push(bulletItem(item))
      }
    }
  } else if (ws.platform === 'microsoft') {
    sections.push(heading2('5.1 Microsoft 365 Configuration'))
    sections.push(
      bodyParagraph(
        'Your organization uses Microsoft 365. The following controls should be configured:'
      )
    )
    bulletItem('Microsoft Purview sensitivity labels for document classification')
    sections.push(bulletItem('Data Loss Prevention (DLP) policies in Exchange and SharePoint'))
    sections.push(bulletItem('Conditional Access policies for device and location-based access'))
    sections.push(bulletItem('Microsoft Defender for Office 365 threat protection'))
    sections.push(bulletItem('Azure Information Protection for email encryption'))
    sections.push(bulletItem('Intune for mobile device management'))
    sections.push(bulletItem('Microsoft Compliance Manager for compliance tracking'))
  } else {
    sections.push(heading2('5.1 Mixed/Other Platform Controls'))
    sections.push(
      bodyParagraph(
        'For organizations using mixed or other platforms, ensure the following controls are in place regardless of platform:'
      )
    )
    sections.push(bulletItem('Multi-factor authentication (MFA) on all accounts'))
    sections.push(bulletItem('Encrypted file storage for Confidential and Restricted data'))
    sections.push(bulletItem('Centralized access control with named-user permissions'))
    sections.push(bulletItem('Mobile device management (MDM) for devices accessing organizational data'))
    sections.push(bulletItem('Email encryption capabilities for sensitive communications'))
    sections.push(bulletItem('Audit logging for access to sensitive data'))
    sections.push(bulletItem('Regular access reviews (quarterly for Confidential, monthly for Restricted)'))
  }

  sections.push(pageBreak())
  return sections
}

function buildRolesSection(ws) {
  return [
    heading1('6. Roles & Responsibilities'),
    heading2('6.1 Data Lead'),
    bodyParagraph(
      'The Data Lead is the primary point of contact for data classification and handling questions. This role may be held by an IT Director, Operations Director, or other designated staff member.'
    ),
    bulletItem('Monitors changes to applicable regulations and updates this policy accordingly'),
    bulletItem('Reviews vendor and partner contracts for data handling compliance'),
    bulletItem('Evaluates data breaches and security incidents for classification impact'),
    bulletItem('Conducts or coordinates annual policy review'),
    bulletItem('Maintains the data inventory and ensures new data types are classified'),

    heading2('6.2 Data Governance Team'),
    bodyParagraph(
      'A cross-functional team that provides input on data classification decisions and policy development.'
    ),
    bulletItem('Identifies opportunities for improving data handling practices'),
    bulletItem('Contributes to policy development and updates'),
    bulletItem('Champions data stewardship within their departments'),
    bulletItem('Participates in annual policy review'),

    heading2('6.3 Department / Program Heads'),
    bulletItem('Ensures all team members complete data classification training'),
    bulletItem('Promotes a culture of data security and responsible handling'),
    bulletItem('Identifies new data types created by their programs and submits for classification'),
    bulletItem('Reports potential incidents or policy violations to the Data Lead'),

    heading2('6.4 All Employees'),
    bulletItem('Follow this policy in all data handling activities'),
    bulletItem('Report data security concerns or incidents immediately to the Data Lead'),
    bulletItem('Complete annual data classification training and acknowledgment'),
    bulletItem('Ask the Data Lead when uncertain about a data type\'s classification'),
    bulletItem('Do not attempt to circumvent security controls'),

    heading2('6.5 Contractors & Partners'),
    bulletItem('Adhere to this policy as specified in their agreement or contract terms'),
    bulletItem('Complete data handling orientation before accessing organizational data'),
    bulletItem('Report any data incidents to their organizational point of contact immediately'),
    bulletItem('Return or securely destroy all organizational data at the end of the engagement'),
    pageBreak(),
  ]
}

function buildLabelingSection(ws) {
  const sections = [
    heading1('7. Labeling Procedures'),
    bodyParagraph(
      'Consistent labeling helps staff quickly identify the sensitivity of information and apply appropriate handling controls.'
    ),
    heading2('7.1 File Naming'),
    bodyParagraph(
      'For Confidential and Restricted files, include the classification tier in the filename:'
    ),
    bulletItem('[CONFIDENTIAL] - Document Name.docx'),
    bulletItem('[RESTRICTED] - Document Name.xlsx'),
    bodyParagraph(
      'Public and Internal files do not require classification in the filename but may be labeled for clarity.'
    ),
  ]

  if (ws.platform === 'google' && ['business_standard', 'business_plus', 'enterprise_standard'].includes(ws.workspaceTier)) {
    sections.push(heading2('7.2 Google Drive Labels'))
    sections.push(
      bodyParagraph(
        'Your Google Workspace tier supports Drive labels. Create a "Data Classification" label with options for each tier (Public, Internal, Confidential, Restricted) and apply it to all files in shared drives.'
      )
    )
    sections.push(bulletItem('Apply the appropriate classification label when creating or uploading files'))
    sections.push(bulletItem('Review and update labels during quarterly data inventory reviews'))
    sections.push(bulletItem('Use DLP rules to automatically detect and flag potentially misclassified files'))
  }

  sections.push(heading2(ws.platform === 'google' && ['business_standard', 'business_plus', 'enterprise_standard'].includes(ws.workspaceTier) ? '7.3 Email Labeling' : '7.2 Email Labeling'))
  sections.push(
    bodyParagraph(
      'When sending Confidential or Restricted information via email:'
    )
  )
  sections.push(bulletItem('Add "[CONFIDENTIAL]" or "[RESTRICTED]" to the email subject line'))
  sections.push(bulletItem('Use encrypted email or confidential mode for Confidential data'))
  sections.push(bulletItem('For Restricted data, use secure file sharing links instead of email attachments whenever possible'))

  sections.push(heading2(ws.platform === 'google' && ['business_standard', 'business_plus', 'enterprise_standard'].includes(ws.workspaceTier) ? '7.4 Physical Documents' : '7.3 Physical Documents'))
  sections.push(
    bodyParagraph(
      'Mark the classification level in the header and/or footer of all printed Confidential and Restricted documents. Store physical copies in locked cabinets with access limited to authorized personnel.'
    )
  )
  sections.push(pageBreak())
  return sections
}

function buildIncidentSection() {
  return [
    heading1('8. Incident Reporting'),
    heading2('8.1 What to Report'),
    bodyParagraph('Report any of the following to the Data Lead immediately:'),
    bulletItem('Unauthorized access to Confidential or Restricted data'),
    bulletItem('Accidental sharing of sensitive data with unintended recipients'),
    bulletItem('Lost or stolen devices containing organizational data'),
    bulletItem('Suspected phishing attacks or compromised accounts'),
    bulletItem('Discovery of sensitive data in unsecured locations'),
    bulletItem('Any other situation that may compromise data security'),

    heading2('8.2 How to Report'),
    bulletItem('Contact the Data Lead immediately by phone, email, or in person'),
    bulletItem('Provide as much detail as possible: what data was involved, when it happened, who was affected'),
    bulletItem('Do not attempt to investigate or remediate on your own'),
    bulletItem('Preserve any evidence (do not delete emails, files, or logs)'),

    heading2('8.3 Response Process'),
    numberedItem('Data Lead evaluates the incident and determines severity'),
    numberedItem('Immediate containment actions are taken (e.g., revoking access, disabling accounts)'),
    numberedItem('If regulated data is involved, Data Lead determines regulatory notification requirements'),
    numberedItem('Incident is documented with root cause analysis'),
    numberedItem('Corrective actions are implemented to prevent recurrence'),
    numberedItem('Affected individuals and regulators are notified as required by law'),
    pageBreak(),
  ]
}

function buildAcknowledgmentSection(ws) {
  return [
    heading1('9. Policy Acknowledgment'),
    bodyParagraph(
      'All employees, contractors, and volunteers with access to organizational data must acknowledge this policy annually and upon initial onboarding.'
    ),
    emptyParagraph(),
    new Paragraph({
      spacing: { after: 120 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      },
      shading: { type: ShadingType.SOLID, color: COLORS.stoneLt },
      children: [
        body(' ', { size: 10 }),
      ],
    }),
    bodyParagraph(
      `I acknowledge that I have read and understand the ${ws.orgName} Data Classification & Handling Policy. I agree to comply with this policy in all my activities involving organizational data. I understand that failure to comply may result in disciplinary action, up to and including termination of employment or engagement.`
    ),
    emptyParagraph(),
    bodyParagraph('Name: _______________________________________________'),
    emptyParagraph(),
    bodyParagraph('Title / Role: ________________________________________'),
    emptyParagraph(),
    bodyParagraph('Signature: ___________________________________________'),
    emptyParagraph(),
    bodyParagraph('Date: ________________________________________________'),
    pageBreak(),
  ]
}

function buildAppendixSection(ws) {
  // Collect all regulations from selected data types
  const regSet = new Set()
  for (const dt of ws.selectedDataTypes) {
    const cat = taxonomy.categories.find((c) => c.id === dt.categoryId)
    if (!cat) continue
    const dataType = cat.dataTypes.find((d) => d.name === dt.dataTypeName)
    if (!dataType || !dataType.regulations) continue
    for (const reg of dataType.regulations) {
      regSet.add(reg)
    }
  }
  // Add manual regulations
  for (const reg of ws.additionalRegulations || []) {
    regSet.add(reg)
  }

  const REGULATION_DESCRIPTIONS = {
    HIPAA: 'The Health Insurance Portability and Accountability Act establishes national standards for protecting sensitive patient health information. Organizations handling protected health information (PHI) must implement administrative, physical, and technical safeguards.',
    '42_CFR_PART_2': '42 CFR Part 2 provides federal confidentiality protections for substance use disorder patient records. These protections are stricter than HIPAA and require specific written consent for most disclosures.',
    'PCI-DSS': 'The Payment Card Industry Data Security Standard applies to all entities that accept, process, store, or transmit credit card information. Compliance requires specific security controls including network segmentation, encryption, and regular testing.',
    STATE_PRIVACY: 'State privacy laws vary by jurisdiction and may impose additional requirements for collecting, storing, and sharing personal information. Examples include the California Consumer Privacy Act (CCPA), New York SHIELD Act, and Illinois BIPA.',
    GDPR: 'The General Data Protection Regulation applies to organizations processing personal data of EU residents. Requirements include lawful basis for processing, data subject rights (access, erasure, portability), and potentially appointing a Data Protection Officer.',
    FERPA: 'The Family Educational Rights and Privacy Act protects the privacy of student education records. Organizations receiving education records from schools must comply with FERPA restrictions on disclosure.',
    VAWA: 'The Violence Against Women Act includes strict confidentiality provisions for domestic violence, sexual assault, and stalking victims. Programs receiving VAWA funding must not disclose victim information without informed, written consent.',
    HMIS: 'Homeless Management Information System data standards require specific privacy protections, security controls, and data quality standards for data entered into local HMIS systems.',
    FCRA: 'The Fair Credit Reporting Act regulates the use of consumer reports (including background checks). Requires specific consent, disclosure, and adverse action procedures.',
    ADA: 'The Americans with Disabilities Act requires that medical and disability information be kept confidential and stored separately from general personnel files.',
    COPPA: 'The Children\'s Online Privacy Protection Act applies to online collection of personal information from children under 13. Requires verifiable parental consent and specific privacy notice provisions.',
    'CAN-SPAM': 'The CAN-SPAM Act governs commercial email messages. Requirements include opt-out mechanisms, accurate sender information, and identification of messages as advertisements.',
    SOX: 'The Sarbanes-Oxley Act whistleblower provisions protect employees who report fraud or misconduct. While primarily a corporate regulation, the whistleblower protections apply to nonprofits.',
  }

  const sections = [heading1('10. Appendix — Regulatory Requirements')]

  if (regSet.size === 0 && (!ws.additionalRegulations || ws.additionalRegulations.length === 0)) {
    sections.push(
      bodyParagraph(
        'No specific regulatory requirements were detected for the selected data types. This does not mean the organization has no compliance obligations. Consult qualified legal counsel for guidance specific to your situation.'
      )
    )
  } else {
    sections.push(
      bodyParagraph(
        'The following regulations have been identified as potentially applicable based on the data types your organization handles:'
      )
    )
    for (const reg of regSet) {
      const desc = REGULATION_DESCRIPTIONS[reg]
      if (desc) {
        sections.push(heading2(reg.replace(/_/g, ' ')))
        sections.push(bodyParagraph(desc))
      } else {
        // Manual regulation
        sections.push(heading2(reg))
        sections.push(
          bodyParagraph(
            `${reg} has been identified as applicable to your organization. Consult qualified legal counsel for specific compliance requirements.`
          )
        )
      }
    }
  }

  return sections
}

/* ─── Main export ────────────────────────────────────────────────────── */

export async function generatePolicy(wizardState) {
  const ws = wizardState

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'numbered-list',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: {
            font: FONT,
            size: BODY_SIZE,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          ...buildCoverSection(ws),
          ...buildPurposeSection(ws),
          ...buildTierSection(),
          ...buildInventorySection(ws),
          ...buildHandlingSection(),
          ...buildPlatformSection(ws),
          ...buildRolesSection(ws),
          ...buildLabelingSection(ws),
          ...buildIncidentSection(),
          ...buildAcknowledgmentSection(ws),
          ...buildAppendixSection(ws),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const safeName = ws.orgName.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+$/, '')
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `Data-Classification-Policy-${safeName}-${dateStr}.docx`
  saveAs(blob, filename)
}

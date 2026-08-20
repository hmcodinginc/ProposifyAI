import io
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from app.models.models import Proposal, User, Client

class PDFGeneratorService:
    @staticmethod
    def _clean_markdown(text: str) -> str:
        if not text:
            return ""
        # Convert simple markdown headers/bold to reportlab tags
        text = re.sub(r'###\s+(.*)', r'<b><font size="12" color="#1e293b">\1</font></b>', text)
        text = re.sub(r'##\s+(.*)', r'<b><font size="14" color="#0f172a">\1</font></b>', text)
        text = re.sub(r'#\s+(.*)', r'<b><font size="16" color="#0f172a">\1</font></b>', text)
        text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
        text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
        text = re.sub(r'`(.*?)`', r'<font face="Courier">\1</font>', text)
        text = text.replace('\n', '<br/>')
        return text

    @classmethod
    def generate_proposal_pdf(cls, proposal: Proposal, owner: User, client: Client = None) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            textColor=colors.HexColor('#0f172a'),
            alignment=TA_LEFT,
            spaceAfter=6
        )

        subtitle_style = ParagraphStyle(
            'DocSubTitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#64748b'),
            alignment=TA_LEFT,
            spaceAfter=15
        )

        section_heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=colors.HexColor('#1e40af'),
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'BodyContent',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#334155'),
            spaceAfter=8,
            alignment=TA_LEFT
        )

        elements = []

        # Company Header Banner
        company_name = owner.company_name or owner.full_name or "ProposifyAI"
        header_text = f"<b>{company_name.upper()}</b> | Business Proposal"
        elements.append(Paragraph(header_text, ParagraphStyle('HeaderBanner', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor('#2563eb'))))
        elements.append(Spacer(1, 8))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563eb'), spaceAfter=15))

        # Proposal Title
        elements.append(Paragraph(proposal.title, title_style))
        elements.append(Paragraph(f"Project Type: {proposal.project_type or 'Custom Project'} | Created: {proposal.created_at.strftime('%B %d, %Y')}", subtitle_style))
        
        # Meta info box (Client & Provider Info)
        client_name = client.name if client else "Valued Client"
        client_company = client.company if (client and client.company) else ""
        client_email = client.email if client else ""

        meta_data = [
            [
                Paragraph("<b>PREPARED FOR:</b>", ParagraphStyle('MetaH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor('#475569'))),
                Paragraph("<b>PREPARED BY:</b>", ParagraphStyle('MetaH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor('#475569')))
            ],
            [
                Paragraph(f"<b>{client_name}</b><br/>{client_company}<br/>{client_email}", body_style),
                Paragraph(f"<b>{owner.full_name or owner.email}</b><br/>{company_name}<br/>{owner.email}", body_style)
            ]
        ]

        meta_table = Table(meta_data, colWidths=[260, 260])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 15))

        # Proposal Sections
        for sec in sorted(proposal.sections, key=lambda x: x.order_index):
            elements.append(Paragraph(sec.title, section_heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceAfter=8))
            cleaned_content = cls._clean_markdown(sec.content)
            elements.append(Paragraph(cleaned_content, body_style))
            elements.append(Spacer(1, 10))

        # Pricing & Investment Section
        if proposal.pricing_items:
            elements.append(Paragraph("Pricing & Investment Summary", section_heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceAfter=10))

            price_table_data = [
                [
                    Paragraph("<b>Milestone / Item</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
                    Paragraph("<b>Description</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
                    Paragraph("<b>Hours</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white, alignment=TA_RIGHT)),
                    Paragraph("<b>Rate</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white, alignment=TA_RIGHT)),
                    Paragraph("<b>Amount</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white, alignment=TA_RIGHT)),
                ]
            ]

            for item in sorted(proposal.pricing_items, key=lambda x: x.order_index):
                price_table_data.append([
                    Paragraph(f"<b>{item.title}</b>", body_style),
                    Paragraph(item.description or "", body_style),
                    Paragraph(f"{item.hours:.1f} hrs", ParagraphStyle('TD', parent=body_style, alignment=TA_RIGHT)),
                    Paragraph(f"${item.rate:.2f}", ParagraphStyle('TD', parent=body_style, alignment=TA_RIGHT)),
                    Paragraph(f"${item.amount:,.2f}", ParagraphStyle('TD', parent=body_style, fontName='Helvetica-Bold', alignment=TA_RIGHT)),
                ])

            # Total row
            price_table_data.append([
                Paragraph("<b>TOTAL ESTIMATED INVESTMENT</b>", ParagraphStyle('TotalL', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor('#0f172a'))),
                Paragraph("", body_style),
                Paragraph("", body_style),
                Paragraph("", body_style),
                Paragraph(f"<b>${proposal.total_price:,.2f} {proposal.currency}</b>", ParagraphStyle('TotalV', fontName='Helvetica-Bold', fontSize=11, textColor=colors.HexColor('#1e40af'), alignment=TA_RIGHT)),
            ])

            pricing_table = Table(price_table_data, colWidths=[140, 190, 55, 55, 80])
            pricing_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
                ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('GRID', (0, 0), (-1, -2), 0.5, colors.HexColor('#e2e8f0')),
                ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f1f5f9')),
                ('PADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(pricing_table)
            elements.append(Spacer(1, 20))

        # Footer sign-off
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#94a3b8'), spaceAfter=15))
        elements.append(Paragraph(f"Generated via <b>ProposifyAI</b> | Confidential & Subject to Agreement", ParagraphStyle('Footer', fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#94a3b8'), alignment=TA_CENTER)))

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

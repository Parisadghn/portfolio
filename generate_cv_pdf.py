# Generates public/cv/Parisa-Dehghan-CV.pdf from the authoritative CV data.
# Stdlib only — no dependencies.
import os

B, R = 'B', 'R'  # bold / regular
PAGE_W, PAGE_H = 612, 792
MARGIN = 50

page1 = [
    (B, 20, 'PARISA DEGHAN'),
    (R, 10, 'Research & Development Specialist  |  IoT  |  Scientific Computing  |  Machine Learning'),
    (R, 9, 'ssparisa@gmail.com  -  Tehran, Iran  -  github.com/Parisadghn  -  linkedin.com/in/parisa-dehghan-697895249'),
    (B, 12, ''),
    (B, 12, 'SUMMARY'),
    (R, 9.5, 'Research and Development and IoT Specialist. M.Sc. in Particle Physics and Field Theory with a strong'),
    (R, 9.5, 'foundation in data analysis, machine learning, quantum field theory, numerical simulations, high-performance'),
    (R, 9.5, 'computing, and scientific machine learning. Proficient in Python, C++, and SQL. Experienced in algorithm'),
    (R, 9.5, 'design, low-power ML deployment, IoT systems, micro/nano fabrication, sensor development, and complex-system research.'),
    (B, 12, ''),
    (B, 12, 'EXPERIENCE'),
    (B, 10, 'Research and Development Specialist - Intelligent Micronano Sensors (Lotus IMNS)     Since May 2024'),
    (R, 9.5, '- AFM sensor development: silicon wafer fabrication, UV lithography, RIE, wet etching, PVD gold deposition.'),
    (R, 9.5, '- High-aspect-ratio tip fabrication; SEM, AFM, and optical microscopy characterization.'),
    (R, 9.5, '- COMSOL multiphysics simulation; Python data analysis; ML-oriented process datasets.'),
    (R, 9.5, '- Microneedle patch development: silicon microneedle masters, PDMS mold fabrication, hydroxyapatite (HA)'),
    (R, 9.5, '  loading, centrifugation, PVP formulations; mechanical optimization of flexibility and brittleness.'),
    (R, 9.5, '- CATIA centrifuge component design; CorelDRAW mask design.'),
    (B, 10, ''),
    (B, 10, 'Internet of Things Specialist - Iran IoT Expansion Center'),
    (R, 9.5, '- Smart health monitoring: GPS, blood pressure, SpO2, and fall detection from smart wristbands.'),
    (R, 9.5, '- LoRa / MQTT telemetry; Node-RED device simulation; Node.js backend services.'),
    (R, 9.5, '- Data validation and timestamping into SQL; real-time web monitoring interface.'),
    (B, 10, ''),
    (B, 10, 'IoT Instructor - Iran IoT Expansion Center'),
    (R, 9.5, '- 6-week online introductory IoT course for students aged 8-12.'),
    (B, 12, ''),
    (B, 12, 'EDUCATION'),
    (B, 10, 'M.Sc. Particle Physics and Field Theory - Shahid Beheshti University     2021-2024     GPA 14.13/20'),
    (R, 9.5, 'Quantum Field Theory II 18.23/20 - Gravity I 17/20 - Advanced Quantum Mechanics 16.02/20'),
    (R, 9.5, 'Advanced Statistical Mechanics 15.9/20 - Geometry and Topology 15/20'),
    (B, 10, ''),
    (B, 10, 'B.Sc. Physics - Alzahra University     2017-2021     GPA 15.66/20'),
    (R, 9.5, 'Numerical Calculations 4/4 - Stochastic Processes 4/4 - Advanced Quantum Mechanics I 4/4'),
    (R, 9.5, 'Computer Programming (Theoretical & Practical) 4/4'),
    (B, 10, ''),
    (B, 10, 'Diploma, Mathematics and Physics - Motahare High School     GPA 19.38/20'),
]

page2 = [
    (B, 12, 'SKILLS'),
    (B, 9.5, 'Programming:'),
    (R, 9.5, '  Python, C, C++, C#, SQL, JavaScript, Fortran, MATLAB'),
    (B, 9.5, 'Machine Learning:'),
    (R, 9.5, '  TensorFlow, Keras, OpenCV, Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn'),
    (B, 9.5, 'Scientific Computing:'),
    (R, 9.5, '  COMSOL, STAR-CCM+, Rivet, Docker, Monte Carlo, SPH, Stochastic Differential Equations'),
    (B, 9.5, 'IoT:'),
    (R, 9.5, '  MQTT, LoRaWAN, Node-RED, Node.js, Raspberry Pi'),
    (B, 9.5, 'Databases:'),
    (R, 9.5, '  SQL Server, Oracle, SQLite, MySQL'),
    (B, 9.5, 'Design:'),
    (R, 9.5, '  CATIA, AutoCAD, CorelDraw, Adobe Illustrator, Adobe InDesign, Photoshop, Lightroom'),
    (B, 12, ''),
    (B, 12, 'SELECTED PROJECTS'),
    (R, 9.5, 'Environmental Monitoring (Raspberry Pi) - Bubble Rise Simulation (SPH + STAR-CCM+ + Python)'),
    (R, 9.5, 'Graph Convolutional Networks (research paper) - Phase Transition in the Ising Model (Metropolis Monte Carlo)'),
    (R, 9.5, 'Stock Price Prediction (RNN / LSTM / BiLSTM) - Anomaly Detection (autoencoder)'),
    (R, 9.5, 'Topological Data Analysis (persistent homology) - Particle Accelerator Simulation (Rivet / Docker)'),
    (R, 9.5, 'Image Classification (TinyML: 50% model-size reduction at >90% accuracy)'),
    (R, 9.5, 'Sentiment Analysis - Cryptocurrency Classification - Breast Cancer Detection - MRI Image Analysis'),
    (R, 9.5, 'Stochastic Thermodynamics - Knapsack Problem - Huffman Coding - Minimum Spanning Tree'),
    (R, 9.5, 'Hamshahri Newspaper Dataset - Calculator / To-Do List / Library Management applications'),
    (B, 12, ''),
    (B, 12, 'CERTIFICATIONS'),
    (R, 9.5, 'SANS SEC505 - Network+ - Security+ (LIAN Group, Sep 2025)'),
    (R, 9.5, 'Certified Ethical Hacker (CEH), Jul 2025 - Software Test Bootcamp, May 2024'),
    (R, 9.5, 'DESY Remote Summer School, 2023 - Stanford Algorithms (Coursera), 2023'),
    (R, 9.5, 'ICTP Workshop on Stochastic Thermodynamics, May 2023'),
    (R, 9.5, 'Applied Machine Learning in Python (University of Michigan / Coursera), Oct 2022'),
    (R, 9.5, 'Workshop on Topological Data Analysis (SBU), Aug 2022 - Python Course (Alzahra University), Oct 2021'),
    (R, 9.5, 'Introduction to C - Introduction to C# - Intermediate SQL'),
    (B, 12, ''),
    (B, 12, 'LANGUAGES'),
    (R, 9.5, 'Persian (native) - English (fluent) - French (intermediate)'),
]

pages = [page1, page2]


def esc(s: str) -> str:
    return s.replace('\\', '\\\\').replace('(', r'\(').replace(')', r'\)')


def content_stream(lines):
    y = PAGE_H - MARGIN - 14
    out = []
    for style, size, text in lines:
        if text:
            font = '/F2' if style == B else '/F1'
            out.append(f'BT {font} {size} Tf {MARGIN} {y:.1f} Td ({esc(text)}) Tj ET')
        y -= (size + 6) if size > 11 else (size + 4)
    return '\n'.join(out).encode('latin-1')


n_pages = len(pages)
font_r_num = 3 + 2 * n_pages
font_b_num = font_r_num + 1

objects = ['<< /Type /Catalog /Pages 2 0 R >>']  # obj 1
kids = ' '.join(f'{3 + 2 * i} 0 R' for i in range(n_pages))
objects.append(f'<< /Type /Pages /Kids [{kids}] /Count {n_pages} >>')  # obj 2
for i, lines in enumerate(pages):
    page_num = 3 + 2 * i
    content_num = page_num + 1
    objects.append(
        f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] '
        f'/Resources << /Font << /F1 {font_r_num} 0 R /F2 {font_b_num} 0 R >> >> '
        f'/Contents {content_num} 0 R >>'
    )
    objects.append(content_stream(lines))
objects.append('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
objects.append('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')

buf = bytearray(b'%PDF-1.4\n')
offsets = []
for num, body in enumerate(objects, start=1):
    if isinstance(body, str):
        body = body.encode('latin-1')
    offsets.append(len(buf))
    buf += f'{num} 0 obj\n'.encode() + body + b'\nendobj\n'

xref_pos = len(buf)
buf += f'xref\n0 {len(objects) + 1}\n'.encode()
buf += b'0000000000 65535 f \n'
for off in offsets:
    buf += f'{off:010d} 00000 n \n'.encode()
buf += f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF'.encode()

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public', 'cv', 'Parisa-Dehghan-CV.pdf')
with open(out_path, 'wb') as f:
    f.write(buf)
print(f'wrote {out_path} ({len(buf)} bytes)')

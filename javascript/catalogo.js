document.addEventListener('DOMContentLoaded', () => {
    const btnDescargar = document.getElementById('btn-descargar-catalogo');
    
    if (btnDescargar) {
        btnDescargar.addEventListener('click', async (e) => {
            e.preventDefault();
            // Feedback visual simple
            const textoOriginal = btnDescargar.textContent;
            btnDescargar.textContent = "Generando PDF...";
            btnDescargar.style.opacity = "0.7";
            
            try {
                await generarPDF();
            } catch (error) {
                console.error("Error al generar PDF:", error);
                alert("Hubo un error al generar el catálogo.");
            } finally {
                btnDescargar.textContent = textoOriginal;
                btnDescargar.style.opacity = "1";
            }
        });
    }
});

async function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(22);
    doc.setTextColor(46, 91, 46); // Color verde #2e5b2eff
    doc.text("Catálogo de Productos", 105, 20, null, null, "center");
    
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Agroindustria S&D FOOD E.I.R.L.", 105, 30, null, null, "center");
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 38, null, null, "center");
    
    // Pre-cargar imágenes
    const dataWithImages = await Promise.all(productos.map(async (prod) => {
        let imgData = null;
        try {
            imgData = await getBase64ImageFromUrl(prod.imagen);
        } catch (e) {
            console.warn(`No se pudo cargar la imagen para ${prod.nombre}`);
        }
        return {
            ...prod,
            imagenData: imgData
        };
    }));

    // Definir las columnas para la tabla
    const columns = [
        { header: "Imagen", dataKey: "imagen" },
        { header: "Producto", dataKey: "nombre" },
        { header: "Categoría", dataKey: "categoria" },
        { header: "Presentación", dataKey: "presentacion" },
        { header: "Descripción", dataKey: "descripcion" }
    ];
    
    // Generar la tabla usando autoTable
    doc.autoTable({
        head: [columns.map(col => col.header)],
        body: dataWithImages.map(item => [
            '', // Placeholder para la imagen (se dibuja en didDrawCell)
            item.nombre,
            item.categoria,
            item.presentacion,
            item.descripcion
        ]),
        startY: 50,
        theme: 'grid',
        headStyles: {
            fillColor: [46, 91, 46], // Verde corporativo
            textColor: 255,
            fontSize: 12,
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
            valign: 'middle',
            overflow: 'linebreak'
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        columnStyles: {
            0: { cellWidth: 25, minCellHeight: 25 }, // Imagen
            1: { cellWidth: 35 }, // Producto
            2: { cellWidth: 25 }, // Categoría
            3: { cellWidth: 30 }, // Presentación
            4: { cellWidth: 'auto' } // Descripción
        },
        didDrawCell: (data) => {
            // Dibujar imagen en la primera columna (índice 0)
            if (data.section === 'body' && data.column.index === 0) {
                const item = dataWithImages[data.row.index];
                if (item && item.imagenData) {
                    // Ajustar imagen centrada en la celda
                    const imgSize = 20;
                    const x = data.cell.x + (data.cell.width - imgSize) / 2;
                    const y = data.cell.y + (data.cell.height - imgSize) / 2;
                    doc.addImage(item.imagenData, 'PNG', x, y, imgSize, imgSize);
                }
            }
        }
    });
    
    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, null, null, "center");
        doc.text("www.agroindustriasdfood.com", 105, 285, null, null, "center");
    }

    // Guardar el PDF
    doc.save("Catalogo_SyD_Food.pdf");
}

// Función auxiliar para convertir imagen a Base64
function getBase64ImageFromUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        
        img.onerror = () => {
            reject(new Error(`Failed to load image at ${url}`));
        };
        
        img.src = url;
    });
}

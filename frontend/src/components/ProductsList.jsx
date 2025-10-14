import React, { useState } from 'react'
import {motion} from 'framer-motion'
import { Trash, Star, SquarePen, Search, X, FileDown } from 'lucide-react'
import { useProductStore }  from '../stores/useProductStore'
import { useNavigate } from 'react-router-dom'
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

function ProductsList() {
  const { products, toggleFeaturedProduct, deleteProduct } = useProductStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

 
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  
  const generateInventoryPDF = () => {
    try {
      
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "A4",
      });

      
      
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129); 
      doc.setFont(undefined, 'bold');
      doc.text("AYUBO LANKA - AYURVEDIC PRODUCTS", 40, 35);
      
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); 
      doc.text("Complete Product Inventory Report", 40, 55);
      
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const now = new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      doc.text(`Generated: ${now}`, 40, 72);

     
      const totalProducts = filteredProducts.length;
      const lowStockProducts = filteredProducts.filter(
        p => p.stock <= p.minimumStock
      ).length;
      const totalInventoryValue = filteredProducts.reduce(
        (sum, p) => sum + (Number(p.price) * Number(p.stock)), 
        0
      );
      const outOfStockProducts = filteredProducts.filter(p => p.stock === 0).length;

      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`Total Products: ${totalProducts}`, 40, 92);
      doc.text(`Low Stock Items: ${lowStockProducts}`, 200, 92);
      doc.text(`Out of Stock: ${outOfStockProducts}`, 360, 92);
      doc.text(`Total Inventory Value: Rs. ${totalInventoryValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 500, 92);

      
      const tableData = filteredProducts.map(product => {
        const stockStatus = product.stock === 0 
          ? '❌ OUT' 
          : product.stock <= product.minimumStock 
            ? '⚠️ LOW' 
            : '✓ OK';
        
        const itemValue = Number(product.price) * Number(product.stock);
        
        return [
          product.name || '-',
          product.category || '-',
          product.description?.substring(0, 50) + (product.description?.length > 50 ? '...' : '') || '-',
          `Rs. ${Number(product.price).toFixed(2)}`,
          product.stock.toString(),
          product.minimumStock.toString(),
          stockStatus,
          `Rs. ${itemValue.toFixed(2)}`,
          product.isFeatured ? '⭐ Yes' : 'No'
        ];
      });

      autoTable(doc, {
        head: [[
          'Product Name', 
          'Category', 
          'Description',
          'Unit Price', 
          'Stock', 
          'Min Stock', 
          'Status', 
          'Total Value',
          'Featured'
        ]],
        body: tableData,
        startY: 110,
        
        styles: {
          fontSize: 8,
          cellPadding: 4,
          overflow: 'linebreak',
          halign: 'left',
        },
        
        headStyles: {
          fillColor: [16, 185, 129], 
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 9,
        },
        
        columnStyles: {
          0: { cellWidth: 100 }, 
          1: { cellWidth: 70 },  
          2: { cellWidth: 120 }, 
          3: { cellWidth: 70, halign: 'right' },  
          4: { cellWidth: 45, halign: 'center' }, 
          5: { cellWidth: 50, halign: 'center' }, 
          6: { cellWidth: 55, halign: 'center' }, 
          7: { cellWidth: 80, halign: 'right' },  
          8: { cellWidth: 55, halign: 'center' }, 
        },

       
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 6) {
            const statusText = data.cell.text[0];
            if (statusText === '❌ OUT') {
              data.cell.styles.fillColor = [254, 202, 202]; 
              data.cell.styles.textColor = [153, 27, 27];   
              data.cell.styles.fontStyle = 'bold';
            } else if (statusText === '⚠️ LOW') {
              data.cell.styles.fillColor = [254, 243, 199]; 
              data.cell.styles.textColor = [146, 64, 14];   
              data.cell.styles.fontStyle = 'bold';
            } else if (statusText === '✓ OK') {
              data.cell.styles.fillColor = [209, 250, 229]; 
              data.cell.styles.textColor = [6, 95, 70];     
            }
          }
        },

        alternateRowStyles: {
          fillColor: [249, 250, 251] 
        },
      });

      
      const categoryStats = {};
      filteredProducts.forEach(p => {
        const cat = p.category || 'Uncategorized';
        if (!categoryStats[cat]) {
          categoryStats[cat] = { 
            count: 0, 
            totalValue: 0,
            lowStock: 0 
          };
        }
        categoryStats[cat].count++;
        categoryStats[cat].totalValue += Number(p.price) * Number(p.stock);
        if (p.stock <= p.minimumStock) {
          categoryStats[cat].lowStock++;
        }
      });

      const categoryData = Object.entries(categoryStats)
        .sort((a, b) => b[1].totalValue - a[1].totalValue) 
        .map(([category, stats]) => [
          category,
          stats.count.toString(),
          `Rs. ${stats.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
          stats.lowStock > 0 ? `⚠️ ${stats.lowStock}` : '✓ None'
        ]);

      const startYForCategory = doc.lastAutoTable.finalY + 20;

      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text("Category-wise Breakdown", 40, startYForCategory);

      autoTable(doc, {
        head: [['Category', 'Product Count', 'Total Value', 'Low Stock Items']],
        body: categoryData,
        startY: startYForCategory + 10,
        margin: { left: 40 },
        tableWidth: 400,
        
        styles: {
          fontSize: 9,
          cellPadding: 5,
        },
        
        headStyles: {
          fillColor: [59, 130, 246], 
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 80, halign: 'center' },
          2: { cellWidth: 120, halign: 'right' },
          3: { cellWidth: 80, halign: 'center' },
        },
      });

      
      const lowStockItems = filteredProducts.filter(
        p => p.stock > 0 && p.stock <= p.minimumStock
      );
      
      const outOfStockItems = filteredProducts.filter(p => p.stock === 0);

      if (lowStockItems.length > 0 || outOfStockItems.length > 0) {
        const startYForAlerts = doc.lastAutoTable.finalY + 20;
        
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(185, 28, 28); 
        doc.text("⚠️ Stock Alerts", 40, startYForAlerts);

        const alertData = [];
        
        
        if (outOfStockItems.length > 0) {
          outOfStockItems.forEach(p => {
            alertData.push([
              '❌ OUT OF STOCK',
              p.name,
              p.category,
              `Current: ${p.stock}`,
              `Minimum: ${p.minimumStock}`,
              `Shortage: ${p.minimumStock} units`
            ]);
          });
        }
        
        
        if (lowStockItems.length > 0) {
          lowStockItems.forEach(p => {
            const shortage = p.minimumStock - p.stock;
            alertData.push([
              '⚠️ LOW STOCK',
              p.name,
              p.category,
              `Current: ${p.stock}`,
              `Minimum: ${p.minimumStock}`,
              `Need: ${shortage} more units`
            ]);
          });
        }

        autoTable(doc, {
          head: [['Alert Type', 'Product Name', 'Category', 'Current Stock', 'Min Required', 'Action Needed']],
          body: alertData,
          startY: startYForAlerts + 10,
          
          styles: {
            fontSize: 8,
            cellPadding: 4,
          },
          
          headStyles: {
            fillColor: [239, 68, 68], 
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
          },
          
          columnStyles: {
            0: { cellWidth: 90, halign: 'center', fontStyle: 'bold' },
            1: { cellWidth: 120 },
            2: { cellWidth: 80 },
            3: { cellWidth: 80, halign: 'center' },
            4: { cellWidth: 80, halign: 'center' },
            5: { cellWidth: 100, halign: 'center' },
          },

          didParseCell: function(data) {
            if (data.section === 'body' && data.column.index === 0) {
              if (data.cell.text[0]?.includes('OUT OF STOCK')) {
                data.cell.styles.fillColor = [254, 202, 202]; 
                data.cell.styles.textColor = [153, 27, 27];   
              } else if (data.cell.text[0]?.includes('LOW STOCK')) {
                data.cell.styles.fillColor = [254, 243, 199]; 
                data.cell.styles.textColor = [146, 64, 14];  
              }
            }
          },
        });
      }

      
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128); 
        doc.setFont(undefined, 'normal');
        
        
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 80,
          doc.internal.pageSize.getHeight() - 20
        );
        
        
        doc.text(
          'Generated by Ayubo Lanka Product Management System',
          40,
          doc.internal.pageSize.getHeight() - 20
        );
      }

      
      const filename = `inventory_report_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      
      console.log(`PDF generated successfully: ${filename}`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  console.log("products:", products);

  return (
    <motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
    
		{/* PDF Export Button Section */}
		<div className='px-6 pt-6 pb-2 flex justify-end'>
			<button
				onClick={generateInventoryPDF}
				disabled={!filteredProducts || filteredProducts.length === 0}
				className='flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white 
						rounded-lg hover:bg-emerald-700 transition-colors font-medium
						disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50
						shadow-md hover:shadow-lg'
				title={filteredProducts?.length > 0 
					? 'Generate PDF report of current inventory' 
					: 'No products available to generate report'}
			>
				<FileDown className='w-5 h-5' />
				<span>Generate Inventory Report (PDF)</span>
			</button>
		</div>

		{/* Search Bar Section */}
		<div className='px-6 pt-4 pb-4'>
			<div className='relative'>
				<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
					<Search className='h-5 w-5 text-gray-400' />
				</div>
				<input
					type='text'
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder='Search products by name...'
					className='block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg 
					bg-gray-700 text-white placeholder-gray-400 
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
					transition duration-200'
				/>
				{searchTerm && (
					<button
						onClick={handleClearSearch}
						className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors'
					>
						<X className='h-5 w-5' />
					</button>
				)}
			</div>
			{searchTerm && (
				<p className='mt-2 text-sm text-gray-400'>
					Found {filteredProducts?.length || 0} product{filteredProducts?.length !== 1 ? 's' : ''}
				</p>
			)}
		</div>

	<div className='overflow-x-auto'>
      <table className=' min-w-full divide-y divide-gray-700'>
          <thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Description
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Category
						</th>
            
            <th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
						  Price
						</th>
            
            <th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Stock
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Featured
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

        <tbody className='bg-gray-800 divide-y divide-gray-700'>
					{filteredProducts?.length > 0 ? (
						filteredProducts.map((product) => (
						<tr key={product._id} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product.image}
											alt={product.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.description}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.category}</div>
							</td>
              <td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{Number(product.price).toFixed(2)}</div>
							</td>
              <td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.stock}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full transition-colors duration-200 ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className={`h-5 w-5 ${product.isFeatured ? 'fill-current' : ''}`} />
								</button>
							</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => handleEditClick(product._id)}
									className='text-indigo-400 hover:text-indigo-300 mr-3'
								>
									<SquarePen className='h-5 w-5' />
								</button>
							</td>

							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => deleteProduct(product._id)}
									className='text-red-400 hover:text-red-300'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))
					) : (
						<tr>
							<td colSpan='7' className='px-6 py-8 text-center'>
								<div className='flex flex-col items-center justify-center'>
									<Search className='h-12 w-12 text-gray-500 mb-3' />
									<p className='text-gray-400 text-lg'>
										{searchTerm ? 'No products found matching your search.' : 'No products available.'}
									</p>
									{searchTerm && (
										<button
											onClick={handleClearSearch}
											className='mt-3 text-green-500 hover:text-green-400 transition-colors'
										>
											Clear search
										</button>
									)}
								</div>
							</td>
						</tr>
					)}
				</tbody>
      </table>
	</div>

    </motion.div>
  )
  
}

export default ProductsList
export const RESTOCK_NOTIFICATION_EMAIL = (productName, currentStock, minimumStock, productId) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Restock Alert - ${productName}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-top: 4px solid #ff6b6b;">
    
    <!-- Header with warning icon -->
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-block; background-color: #ff6b6b; color: white; width: 60px; height: 60px; border-radius: 50%; line-height: 60px; font-size: 30px; margin-bottom: 10px;">
        ⚠️
      </div>
      <h2 style="color: #ff6b6b; margin: 10px 0;">LOW STOCK ALERT</h2>
    </div>

    <!-- Product Information -->
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 5px 0; font-size: 16px;"><strong>Product:</strong> ${productName}</p>
      <p style="margin: 5px 0; font-size: 16px;"><strong>Product ID:</strong> ${productId}</p>
      <p style="margin: 5px 0; font-size: 16px; color: #d32f2f;"><strong>Current Stock:</strong> ${currentStock} units</p>
      <p style="margin: 5px 0; font-size: 16px;"><strong>Minimum Stock Level:</strong> ${minimumStock} units</p>
    </div>

    <!-- Alert Message -->
    <div style="padding: 15px; background-color: #f8f9fa; border-radius: 4px; margin: 20px 0;">
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        The stock level for <strong>${productName}</strong> has fallen to or below the minimum threshold. 
        Immediate restocking is required to prevent stockouts and maintain inventory levels.
      </p>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
        <strong>Action Required:</strong> Please arrange for restocking of this product as soon as possible.
      </p>
      <div style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Restock ${productName}
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px;">
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        This is an automated notification from AYUBO LANKA Inventory Management System.
      </p>
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        <strong>Generated on:</strong> ${new Date().toLocaleString('en-US', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        })}
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 15px;">
        &copy; 2025 AYUBO LANKA Ayurvedic Medical Center. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
`;

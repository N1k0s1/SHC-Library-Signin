/**
 * Test Integration Script
 * This file can be used to test the API integration
 */

import { apiService } from '../services/ApiService';

export class IntegrationTester {
  static async runTests(): Promise<void> {
    console.log('🧪 Starting API Integration Tests...\n');

    // Test 1: Health Check
    await this.testHealthCheck();
    
    // Test 2: Student Sign-in/out
    await this.testStudentSignInOut();
    
    console.log('✅ All integration tests completed!');
  }

  private static async testHealthCheck(): Promise<void> {
    console.log('1️⃣ Testing Health Check...');
    
    try {
      const result = await apiService.checkHealth();
      if (result.success) {
        console.log('   ✅ Health check passed');
      } else {
        console.log('   ❌ Health check failed:', result.message);
      }
    } catch (error) {
      console.log('   ❌ Health check error:', error);
    }
    
    console.log('');
  }

  private static async testStudentSignInOut(): Promise<void> {
    console.log('2️⃣ Testing Student Sign-in/out...');
    
    const testStudentId = '12345';
    
    try {
      // Test sign-in/out toggle
      const result = await apiService.toggleStudentSignInOut(testStudentId);
      
      if (result.success) {
        console.log(`   ✅ Toggle successful - Action: ${result.action}`);
        console.log(`   📝 Message: ${result.message}`);
      } else {
        console.log('   ❌ Toggle failed:', result.message);
      }
      
      // Test get status
      const statusResult = await apiService.getStudentStatus(testStudentId);
      
      if (statusResult.success && statusResult.data) {
        console.log(`   ✅ Status check successful - In Library: ${statusResult.data.isInLibrary}`);
      } else {
        console.log('   ❌ Status check failed:', statusResult.message);
      }
      
    } catch (error) {
      console.log('   ❌ Student sign-in/out error:', error);
    }
    
    console.log('');
  }

  static async testConnection(): Promise<boolean> {
    console.log('🔗 Testing Backend Connection...');
    
    try {
      const isConnected = await apiService.testConnection();
      
      if (isConnected) {
        console.log('✅ Backend connection successful!');
        return true;
      } else {
        console.log('❌ Backend connection failed!');
        return false;
      }
    } catch (error) {
      console.log('❌ Connection test error:', error);
      return false;
    }
  }
}

// Export for use in components
export default IntegrationTester;
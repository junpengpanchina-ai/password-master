'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { generatePassword, calculatePasswordStrength, type PasswordOptions } from '@/lib/password-generator';
import { Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  const { toast } = useToast();

  const generateNewPassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        toast({
          title: "复制成功！",
          description: "密码已复制到剪贴板",
          duration: 2000,
        });
      } catch (err) {
        toast({
          title: "复制失败",
          description: "无法复制到剪贴板，请手动复制",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      toast({
        title: "没有密码可复制",
        description: "请先生成密码",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const strength = calculatePasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            密码生成器
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            生成安全、强壮的密码
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>生成的密码</CardTitle>
            <CardDescription>
              点击复制按钮将密码复制到剪贴板
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="pr-20 text-lg font-mono"
                  placeholder="点击生成按钮创建密码"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={generateNewPassword} className="shrink-0">
                <RefreshCw className="h-4 w-4 mr-2" />
                生成
              </Button>
            </div>

            {password && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">密码强度</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {strength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>密码设置</CardTitle>
            <CardDescription>
              自定义密码生成选项
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 密码长度 */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                密码长度: {options.length}
              </Label>
              <Slider
                value={[options.length]}
                onValueChange={(value) => setOptions({ ...options, length: value[0] })}
                max={50}
                min={4}
                step={1}
                className="w-full"
              />
            </div>

            {/* 字符类型选项 */}
            <div className="space-y-4">
              <Label className="text-base font-medium">字符类型</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={options.includeUppercase}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeUppercase: checked as boolean })
                    }
                  />
                  <Label htmlFor="uppercase">大写字母 (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={options.includeLowercase}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeLowercase: checked as boolean })
                    }
                  />
                  <Label htmlFor="lowercase">小写字母 (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={options.includeNumbers}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeNumbers: checked as boolean })
                    }
                  />
                  <Label htmlFor="numbers">数字 (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={options.includeSymbols}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeSymbols: checked as boolean })
                    }
                  />
                  <Label htmlFor="symbols">特殊符号 (!@#$%^&*)</Label>
                </div>
              </div>
            </div>

            {/* 高级选项 */}
            <div className="space-y-4">
              <Label className="text-base font-medium">高级选项</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="exclude-similar">排除相似字符</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      排除容易混淆的字符 (如 0, O, 1, l)
                    </p>
                  </div>
                  <Switch
                    id="exclude-similar"
                    checked={options.excludeSimilar}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, excludeSimilar: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="exclude-ambiguous">排除歧义字符</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      排除可能引起歧义的字符
                    </p>
                  </div>
                  <Switch
                    id="exclude-ambiguous"
                    checked={options.excludeAmbiguous}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, excludeAmbiguous: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>💡 提示：使用至少12位长度，包含大小写字母、数字和符号的密码最安全</p>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

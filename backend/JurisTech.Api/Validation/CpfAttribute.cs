using System.ComponentModel.DataAnnotations;

namespace JurisTech.Api.Validation;

/// <summary>Valida CPF pelos dígitos verificadores (mesma regra do frontend).</summary>
public sealed class CpfAttribute : ValidationAttribute
{
    public CpfAttribute() : base("CPF inválido.") { }

    public override bool IsValid(object? value)
    {
        if (value is not string s) return value is null;
        var d = new string(s.Where(char.IsDigit).ToArray());
        if (d.Length != 11 || d.Distinct().Count() == 1) return false;
        int Calc(int len)
        {
            var sum = 0;
            for (var i = 0; i < len; i++) sum += (d[i] - '0') * (len + 1 - i);
            var r = sum * 10 % 11;
            return r == 10 ? 0 : r;
        }
        return Calc(9) == d[9] - '0' && Calc(10) == d[10] - '0';
    }

    public static string Digits(string s) => new(s.Where(char.IsDigit).ToArray());
}

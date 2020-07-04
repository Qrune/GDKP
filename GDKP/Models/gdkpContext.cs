using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace GDKP.Models
{
    public partial class gdkpContext : DbContext
    {
        public gdkpContext()
        {
        }

        public gdkpContext(DbContextOptions<gdkpContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Items> Items { get; set; }
        public virtual DbSet<Players> Players { get; set; }
        public virtual DbSet<Raids> Raids { get; set; }
        public virtual DbSet<Records> Records { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=tcp:gdkp.database.windows.net,1433;Initial Catalog=gdkp;Persist Security Info=False;User ID=gaoy2;Password=Rh@980721;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Items>(entity =>
            {
                entity.HasKey(e => e.ItemId)
                    .HasName("PK_items");

                entity.Property(e => e.ItemId).HasColumnName("itemID");

                entity.Property(e => e.ItemName).HasColumnName("itemName");
            });

            modelBuilder.Entity<Players>(entity =>
            {
                entity.HasKey(e => e.PlayerId)
                    .HasName("PK_players");

                entity.HasIndex(e => e.PlayerName)
                    .HasName("IX_Players");

                entity.Property(e => e.PlayerId).HasColumnName("playerID");

                entity.Property(e => e.PlayerName)
                    .HasColumnName("playerName")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Raids>(entity =>
            {
                entity.HasKey(e => e.RaidId);

                entity.HasIndex(e => e.RaidDate)
                    .HasName("IX_Raid");

                entity.Property(e => e.RaidId).HasColumnName("raidID");

                entity.Property(e => e.RaidDate)
                    .HasColumnName("raidDate")
                    .HasColumnType("date");

                entity.Property(e => e.RaidName)
                    .IsRequired()
                    .HasColumnName("raidName")
                    .HasMaxLength(255);

                entity.Property(e => e.RaidPeople).HasColumnName("raidPeople");

                entity.Property(e => e.RaidSubsidyPeople).HasColumnName("raidSubsidyPeople");

                entity.Property(e => e.RaidTax).HasColumnName("raidTax");

                entity.Property(e => e.RaidWcl).HasColumnName("raidWcl");
            });

            modelBuilder.Entity<Records>(entity =>
            {
                entity.HasKey(e => e.RecordId);

                entity.Property(e => e.RecordId).HasColumnName("recordID");

                entity.Property(e => e.Amount).HasColumnName("amount");

                entity.Property(e => e.Comment)
                    .HasColumnName("comment")
                    .IsUnicode(false);

                entity.Property(e => e.ItemId).HasColumnName("itemID");

                entity.Property(e => e.PlayerId).HasColumnName("playerID");

                entity.Property(e => e.RaidId).HasColumnName("raidID");

                entity.HasOne(d => d.Item)
                    .WithMany(p => p.Records)
                    .HasForeignKey(d => d.ItemId)
                    .HasConstraintName("FK__Records__itemID__68487DD7");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.Records)
                    .HasForeignKey(d => d.PlayerId)
                    .HasConstraintName("FK__Records__playerI__693CA210");

                entity.HasOne(d => d.Raid)
                    .WithMany(p => p.Records)
                    .HasForeignKey(d => d.RaidId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Records__raidID__6A30C649");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
